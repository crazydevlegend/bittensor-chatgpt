import { Message } from '@/types/chat';

import { BITAPAI_API_HOST } from '../../app/const';

export class BitAPAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BitAPAIError';
  }
}

export const BitAPAIConversation = async (
  key: string,
  messages: Message[],
  systemPrompt: string,
) => {
  const url = `${BITAPAI_API_HOST}/text`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': `${key ? key : process.env.BITAPAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify([
      {
        role: 'system',
        prompt: systemPrompt,
      },
      ...messages.map((message) => ({
        role: message.role,
        prompt: message.content,
      })),
    ]),
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw new BitAPAIError(`BitAPAI: ${json}`);
  }

  return json?.['response_data'][0]?.response || '';
};
