type RequestData = {
  text?: string;
  'source-countries'?: string;
  language?: string;
  'min-sentiment'?: number;
  'max-sentiment'?: number;
  'earliest-publish-date'?: string;
  'latest-publish-date'?: string;
  'news-sources'?: string;
  authors?: string;
  entities?: string;
  'location-filter'?: string;
  number?: number;
};

export const runPlugin = async (data?: RequestData) => {
  const resp: any = await fetch(
    'https://api.worldnewsapi.com/search-news?' +
      new URLSearchParams({
        'api-key': `${process.env.WORLDNEWS_API_KEY}`,
        // ...data,
      }),
  ).then((res) => res.json());
  return resp;
};

export default {
  id: 'world-news',
  name: 'World News',
  description: 'Provides world news from various sources.',
  parameters: {
    text: {
      type: 'string',
      description: 'The text to match in the news content.',
    },
    'source-countries': {
      type: 'string',
      description:
        'A comma-separated list of ISO 3166 country codes from which the news should originate.',
    },
    language: {
      type: 'string',
      description: 'The ISO 6391 language code of the news.',
    },
    'min-sentiment': {
      type: 'number',
      description: 'The minimal sentiment of the news in range [-1,1].',
    },
    'max-sentiment': {
      type: 'number',
      description: 'The maximal sentiment of the news in range [-1,1].',
    },
    'earliest-publish-date': {
      type: 'string',
      description: 'The news must have been published after this date.',
    },
    'latest-publish-date': {
      type: 'string',
      description: 'The news must have been published before this date.',
    },
    'news-sources': {
      type: 'string',
      description:
        'A comma-separated list of news sources from which the news should originate.',
    },
    authors: {
      type: 'string',
      description:
        'A comma-separated list of author names. Only news from any of the given authors will be returned.',
    },
    entities: {
      type: 'string',
      description: 'Filter news by entities (see semantic types).',
    },
    'location-filter': {
      type: 'string',
      description:
        'Filter news by radius around a certain location. Format is "latitude,longitude,radius in kilometers".',
    },
    number: {
      type: 'number',
      description: 'The number of news to return in range [1,100].',
    },
  },
  run: runPlugin,
};
