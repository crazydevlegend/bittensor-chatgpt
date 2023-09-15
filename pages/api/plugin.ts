import { plugins as allPlugins } from './plugins';

export async function choose_plugin(
  message: string,
  plugins: string[],
  api: string,
  url: string,
  uids: number [],
) {
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
Parameters: ${JSON.stringify(plugin.parameters)}\n`;
  })
  .join('\n')}

You must respond only with json format with type of followings
{"plugin":PLUGIN_NAME, "parameters":{PARAM1:PARAM1_VALUE,PARAM2:PARAM2_VALUE,...}}`;
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
    uids,
    return_all: true,
  };

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api}`,
    },
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.json());

  const response_texts = response.choices.map(
    (each: any) => each.message.content,
  );

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

      const plugin_response = await plugin.run(valid_response.parameters);

      return `This is response of ${
        plugin.id
      } plugin for "${message}" ${JSON.stringify(plugin_response)}
`;
    }
  }
  return '';
}

function validate_response(resp_text: string) {
  try {
    const resp_json = JSON.parse(resp_text);

    if (resp_json.plugin && resp_json.parameters) {
      const plugin = allPlugins.find(
        (plugin) => plugin.id === resp_json.plugin,
      );

      if (!plugin) return false;
      if (
        Object.keys(plugin.parameters).some((key) => !resp_json.parameters[key])
      )
        return false;
      return true;
    }
  } catch (error) {}
  return false;
}
