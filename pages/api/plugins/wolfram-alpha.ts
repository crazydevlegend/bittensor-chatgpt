interface Subpod {
  plaintext?: string;
}

interface Pod {
  title: string;
  subpods?: Subpod[];
}

function findResultPlaintext(pods: Pod[]): string[] {
  const resultPlaintexts: string[] = [];

  const findPlaintextInPods = (keyword: string) => {
    for (const pod of pods) {
      if (pod.title.toLowerCase().includes(keyword)) {
        if (pod.subpods && pod.subpods.length > 0) {
          const subpod = pod.subpods[0];
          if (subpod.plaintext) {
            resultPlaintexts.push(subpod.plaintext);
          }
        }
      }
    }
  };

  findPlaintextInPods('result');

  if (resultPlaintexts.length === 0) {
    findPlaintextInPods('relationship');
  }

  return resultPlaintexts;
}

export const runPlugin = async ({ q }: { q: string }): Promise<string> => {
  try {
    const resp: any = await fetch(
      `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(
        q,
      )}&format=plaintext&output=JSON&appid=${
        process.env.WOLFRAM_APLHA_APP_ID
      }`,
    ).then((res) => res.json());

    if (resp['queryresult']['pods'] && resp['queryresult']['pods'].length > 0) {
      const pods: Pod[] = resp['queryresult']['pods'];
      const resultPlaintexts = findResultPlaintext(pods);
      
      if (resultPlaintexts.length === 0) return '';
      const plaintext = resultPlaintexts.join('\n');
      return `Here's the Wolfram Alpha search result for the user query:\nResults:\n${plaintext}`;
    } else {
      return '';
    }
  } catch (err) {
    return '';
  }
};

export default {
  id: 'wolfram-alpha',
  name: 'WolframAlpha',
  description:
    'Searches WolframAlpha for the given query and returns the results.',
  parameters: {
    q: {
      type: 'string',
      description: 'Query',
    },
  },
  run: runPlugin,
};
