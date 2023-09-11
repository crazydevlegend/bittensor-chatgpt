/*
https://drive.usercontent.google.com/download?id=1Dj87_E1ykhW7jtYB7X8fI-1tvAE6jn0f&export=download&authuser=0&confirm=t&uuid=a26c4de7-bdd5-429b-9340-ada3a97602a1&at=APZUnTUjfXIFRoSsdFz-YNdzYjc3:1692883070241
*/
import { BITAPAI_API_HOST } from '@/utils/app/const';

import { plugins as allPlugins } from './plugins';

export async function choose_plugin(
  message: string,
  plugins: string[],
  api: string,
  others: any
) {
  console.log("------others----", message, plugins, api, others);
  if (!plugins || plugins.length == 0) {
    return '';
  }
  const plugins_with_description = allPlugins.filter((plugin) =>
    plugins.includes(plugin.id),
  );
  if (plugins_with_description.length == 0) return '';
  let systemPrompt = `You are an AI assistant.
This is the start of conversation.
Here are list of plugins

${plugins_with_description
  .map((plugin, index) => {
    return `${index + 1}.
Name: ${plugin.id}
Description: ${plugin.description}
Parameters: ${plugin.id == "chatpdf" ? JSON.stringify({"sourceId":{"type":"string","description":`This must be '${others.publicPDFLink}'`},"text":{"type":"string","description":`This must be '${message}'`}}) : JSON.stringify(plugin.parameters)}\n`;
  })
  .join('\n')}

You must respond only with json format with type of followings{"plugin":PLUGIN_NAME, "parameters":{PARAM1:PARAM1_VALUE,PARAM2:PARAM2_VALUE,...}}`;
  const data = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    // uids: (new Array(16)).fill(22),
    count: 20,
    return_all: true,
  };

  console.log("---------", data);
  const response = await fetch(`${BITAPAI_API_HOST}/text`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': api,
    },
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.json());

  const response_texts = response.choices.map(
    (each: any) => each.message.content,
  );
  console.log("----------", response_texts);

  const valid_responses = response_texts.filter((each: string) =>
    validate_response(each),
  );
  if (valid_responses.length > 0) {
    const valid_response = JSON.parse(valid_responses[0]);
    const plugin = allPlugins.find(
      (plugin) => plugin.id === valid_response.plugin,
    );

    if (plugin) {
      console.log('running plugin');

      console.log("----------valid response", valid_response.parameters);

      const plugin_response = await plugin.run(valid_response.parameters);
      console.log('after function');
      return `This is response of ${
        plugin.id
      } plugin for "${message}" ${JSON.stringify(plugin_response)}
`;
    }
  }
  return '';
}

const isWebDevPluginWithMatcParam = (plugin: any, resp_json: any) => {
  const isWebDevPlugin = plugin.id === 'web-dev';
  const hasMatchingParameters = Object.keys(resp_json.parameters).every(
    (key) => plugin.parameters[key],
  );
  return isWebDevPlugin && hasMatchingParameters;
};

function validate_response(resp_text: string) {
  try {
    const resp_json = JSON.parse(resp_text);

    if (resp_json.plugin && resp_json.parameters) {
      const plugin = allPlugins.find(
        (plugin) => plugin.id === resp_json.plugin,
      );

      console.log("****************");
      console.log(resp_json.parameters);
      console.log("****************");
      if (!plugin) return false;
      if (isWebDevPluginWithMatcParam(plugin, resp_json)) return true;
      if (Object.keys(plugin.parameters).some((key) => !resp_json.parameters[key]))
        return false;
      return true;
    }
  } catch (error) {}
  return false;
}
