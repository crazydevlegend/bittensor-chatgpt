export const runPlugin = async ({ query }: { query: string }) => {
  const resp: any = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${query}`,
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

  return items;
};

export default {
  id: 'google-search',
  name: 'Google Search',
  description: 'Searches Google for the given query and returns the results.',
  parameters: {},
  run: runPlugin,
};
