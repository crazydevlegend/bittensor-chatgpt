import { Message } from '@/types/chat';

import { BITAPAI_API_HOST, VALIDATOR_ENDPOINT_API_HOST } from '../app/const';
import { IModel } from './models.types';

export const Models: Array<IModel> = [
  {
    id: 'bitapai',
    name: 'BitAPAI',
    endpoint: `${BITAPAI_API_HOST}/text`,
    requestBuilder: (secret, data) => {
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': secret,
        },
        method: 'POST',
        body: JSON.stringify({
          messages: data,
          // count: 1,
          // return_all: true,
        }),
      };
    },
    responseExtractor: (json: any) => {
      return json?.['choices'][0]['message'].content || '';
    },
    errorExtractor: (json: any) => {
      return `BitAPAI Error: ${json?.error || 'Unknown error'}`;
    },
    defaultPrompt:
      "**Start new session** You are an AI assistant. Follow the user's instructions carefully. Respond using markdown.",
  },
  {
    id: 'validator-endpoint',
    name: 'Validator Endpoint',
    endpoint: `${VALIDATOR_ENDPOINT_API_HOST}/chat`,
    requestBuilder: (secret, data) => {
      return {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        method: 'POST',
        body: JSON.stringify({ messages: data, top_n: 1 }),
      };
    },
    responseExtractor: (json: any) => {
      return json?.['choices'][0]['message']['content'] || '';
    },
    errorExtractor: (json: any) => {
      return `Validator Endpoint Error: ${json?.detail || 'Unknown error'}`;
    },
    defaultPrompt:
      "You are an AI assistant. Follow the user's instructions carefully.",
  },
];
