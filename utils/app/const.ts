export const title = 'Bittensor Chat';

export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "*Start new session** You are an AI assistant. Follow the user's instructions carefully. Respond using markdown.";

export const NEXT_PUBLIC_VALIDATOR_ENDPOINT_BASE_URL =
  process.env.NEXT_PUBLIC_VALIDATOR_ENDPOINT_BASE_URL ||
  'https://validator-api.fabhed.dev';
export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE = parseFloat(
  process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || '1',
);

export const OPENAI_API_TYPE = process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID = process.env.AZURE_DEPLOYMENT_ID || '';

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';
