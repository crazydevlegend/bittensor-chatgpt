export const runPlugin = async ({ q }: { q: string }) => {
  const resp: any = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${q}`,
  ).then((res) => res.json());

  // extract 'htmlTitle', 'link', 'displayLink', 'htmlSnippet','htmlFormattedUrl', 'pagemap' from resp.items
  const items = resp.items.map((item: any) => {
    return {
      htmlTitle: item.htmlTitle,
      link: item.link,
      displayLink: item.displayLink,
      htmlSnippet: item.htmlSnippet,
      htmlFormattedUrl: item.htmlFormattedUrl,
    };
  });

  return (
    "Here's the google search result for the user query:\n" +
    items.join('\n') +
    'Please analyze the search results from the Google Search Engine API and generate concise and human-readable responses based on the information you find. Your goal is to provide accurate and valuable insights to users based on the search results.'
  );
};

export default {
  id: 'google-search',
  name: 'Google Search',
  description: 'Searches Google for the given query and returns the results.',
  parameters: {
    q: {
      type: 'string',
      description: 'Query',
    },
  },
  run: runPlugin,
};
