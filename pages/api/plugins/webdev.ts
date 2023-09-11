export const runPlugin = async ({
    html,
    css,
    js,
  }: {
    html: string;
    css: string;
    js: string;
  }): Promise<string> => {
    try {
      let queryString = `https://web-dev-chat-gpt-plugin.vercel.app/upload?html=${html}`;
      if (css) {
        queryString += `&css=${css}`;
      }
      if (js) {
        queryString += `&js=${js}`;
      }
  
      const response = await fetch(`${queryString}`, {
        method: 'POST',
      });
      const textResponse = await response.text();
      return textResponse;
    } catch (err) {
      console.error('Error - WebDev', err);
      return 'An error occurred while Making Website.';
    }
  };
  
  export default {
    id: 'web-dev',
    name: 'WebDev',
    description:
      'Build a live website within seconds directly from the chat and preview and test HTML code with JavaScript and CSS.',
    parameters: {
      html: {
        type: 'string',
        description: 'The HTML file to be uploaded',
        required: true,
      },
      css: {
        type: 'string',
        description: 'The CSS file to be uploaded',
      },
      js: {
        type: 'string',
        description: 'The JS file to be uploaded',
      },
    },
    run: runPlugin,
  };