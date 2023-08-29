import { NextResponse } from 'next/server';

import {
  APIError,
  ConversationApi,
} from '@/utils/server/integrations/conversation';

import { ChatBody, Message } from '@/types/chat';

import { choose_plugin } from './plugin';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages, key, prompt, api, plugins, others } =
      (await req.json());

    // let promptToSend = prompt;
    // if (!promptToSend) {
    //   promptToSend = DEFAULT_SYSTEM_PROMPT;
    // }

    const plugin_assistant = await choose_plugin(
      messages[messages.length - 1].content,
      plugins,
      key,
      others,
    );
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

    const response = await ConversationApi({
      key,
      messages: messagesToSend,
      systemPrompt: prompt,
      apiId: api,
    });

    return new Response(response);
  } catch (error) {
    console.error(error);
    if (error instanceof APIError) {
      return NextResponse.json(
        { type: 'Error', error: error.message },
        {
          status: 500,
        },
      );
    } else {
      return NextResponse.json(
        { type: 'Error', error: 'Unknown error occured' },
        { status: 500 },
      );
    }
  }
};

export default handler;
