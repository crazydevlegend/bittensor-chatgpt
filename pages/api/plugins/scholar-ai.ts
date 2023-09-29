const extractKeywords = (chatbotQuery: string): string => {
    // Define a list of common stop words to exclude
    const stopWords = [
      'a',
      'an',
      'the',
      'in',
      'on',
      'at',
      'of',
      'for',
      'with',
      'to',
      'and',
      'or',
    ];
  
    const words = chatbotQuery.split(/\s+/);
  
    const keywords = words.filter((word) => {
      const lowercasedWord = word.toLowerCase();
      return !stopWords.includes(lowercasedWord);
    });
  
    const keywordsString = keywords.join(' ');
  
    return keywordsString;
  };
  
  export const runPlugin = async ({ query }: { query: string }): Promise<any> => {
    const keywords = extractKeywords(query);
    try {
      const resp = await fetch(
        `https://scholar-ai.net/api/abstracts?keywords=${encodeURIComponent(
          keywords,
        )}&query=${encodeURIComponent(query)}`,
      ).then((res) => res.json());
  
      if (resp && resp.paper_data) {
        const abstracts = resp.paper_data;
  
        const response = abstracts.map((abstract: any) => ({
          title: abstract.title,
          abstract: abstract.abstract,
          doi: abstract.doi,
          pdf_url: abstract.pdf_url,
          publicationDate: abstract.publicationDate,
          cited_by_count: abstract.cited_by_count,
          creators: abstract.creators.join(', '),
        }));
  
        // You can return the processed response to the user
        return response;
      } else {
        return '';
      }
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  };
  
  export default {
    id: 'scholar-ai',
    name: 'ScholarAI',
    description: 'Get relevant paper abstracts by keywords search',
    parameters: {
      query: {
        type: 'string',
        description: 'The user query',
        required: true,
      },
    },
    run: runPlugin,
  };