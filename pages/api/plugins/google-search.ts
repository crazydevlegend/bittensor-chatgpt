export const runPlugin = async ({ q }: { q?: string }) => {
  const resp: any = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${q}`,
  ).then((res) => res.json());

  // extract 'htmlTitle', 'link', 'displayLink', 'htmlSnippet','htmlFormattedUrl', 'pagemap' from resp.items
  const items = resp.items.map((item: any) => {
    return {
      title: item.title,
      htmlTitle: item.htmlTitle,
      link: item.link,
      displayLink: item.displayLink,
      snippet: item.snippet,
      htmlSnippet: item.htmlSnippet,
      formattedUrl: item.formattedUrl,
      htmlFormattedUrl: item.htmlFormattedUrl,
    };
  });

  return (
    "Here's the google search result for the user query:\n" +
    items.join('\n') +
    "\n\nNow, I need you to analyze these search results and provide a detailed summary. Here's what you should focus on:\n" +
    "- The main idea or theme of each search result\n" +
    "- Any common patterns or themes across the search results\n" +
    "- Noteworthy or surprising details from the search results\n" +
    "- Any other insights or conclusions you can draw from the search results\n\n" +
    "Remember, your goal is to provide the search result in bullets as well as a comprehensive and understandable summary of these search results below."
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
