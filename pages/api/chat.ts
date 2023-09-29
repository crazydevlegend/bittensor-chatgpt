import {
  DEFAULT_SYSTEM_PROMPT,
  NEXT_PUBLIC_VALIDATOR_ENDPOINT_BASE_URL,
} from '@/utils/app/const';

import { ChatBody, Message } from '@/types/chat';
import { choose_plugin } from './plugin';

export const config = {
  runtime: 'edge',
};

export class ValidatorEndpointError extends Error {
  failed_responses: any[];
  constructor(json: any) {
    super(json?.detail || 'Unknown error');
    this.name = 'ValidatorEndpointError';
    this.failed_responses = json?.failed_responses || [];
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages, key, prompt, uid, plugins, others } = (await req.json());
    const url = NEXT_PUBLIC_VALIDATOR_ENDPOINT_BASE_URL + '/conversation';
    const res_uids = await fetch(`https://test.neuralinternet.ai/top_miner_uids?n=20`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      method: 'GET',
    });
    const top_miner_uids = await res_uids.json();

    console.log("plugins", plugins);
    const plugin_assistant = await choose_plugin(
      messages[messages.length - 1].content,
      plugins,
      key,
      url,
      top_miner_uids,
      others
    );

    console.log("plugin_assistant", plugin_assistant);
    if (plugin_assistant) {
      const lastMessage = messages.pop();
      messages.push({
        role: 'assistant',
        content: plugin_assistant,
      });
      if (lastMessage) messages.push(lastMessage);
    }

    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      messagesToSend = [message, ...messagesToSend];
    }

    // const strategy: {
    //   uids?: number[];
    //   top_n?: number;
    // } = {};
    // if (uid !== undefined) {
    //   strategy.uids = [uid];
    // } else {
    //   strategy.top_n = 20;
    // }
    const strategy = {uids: top_miner_uids};
    const body = {
      messages: [
        {
          role: 'system',
          content: prompt || DEFAULT_SYSTEM_PROMPT,
        },
        ...messages,
      ],
      ...strategy,
    };

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.status !== 200) {
      const json = await res.json();
      throw new ValidatorEndpointError(json);
    }
    const text = await res.text();
    return new Response(text);
  } catch (error) {
    console.error(error);
    if (error instanceof ValidatorEndpointError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          failed_responses: error.failed_responses,
        }),
        {
          status: 500,
        },
      );
    } else {
      return new Response(JSON.stringify({ error: 'Unknown error' }), {
        status: 500,
      });
    }
  }
};

export default handler;
