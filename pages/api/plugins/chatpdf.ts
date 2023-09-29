import axios from "axios"

export const runPlugin = async ({ sourceId, text }: { sourceId:string, text: string }) => {
  console.log(sourceId, text);
  const config = {
    headers: {
      "x-api-key": `${process.env.NEXT_PUBLIC_CHATPDF_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const data = {
    "sourceId": sourceId,
    "messages": [
      {
        "role": "user",
        "content": text
      }
    ]
  };

  console.log("\n", data, config);

  const res = await fetch("https://api.chatpdf.com/v1/chats/message",{
    method: "POST",
    headers: {
      "x-api-key": `${process.env.NEXT_PUBLIC_CHATPDF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .catch((error) => {
    console.log("error");
    console.error("Error:", error.message);
    console.log("Response:", error.response.data);
  });
  console.log("res->",res);
  return res;
};

export default {
  id: 'chatpdf',
  name: 'ChatPDF',
  description: 'Helpful for students, researchers, and professionals',
  parameters: {
    sourceId: {
      type: 'string',
      description: 'This parameter is already given',
    },
    text: {
      type: 'string',
      description: 'This parameter is already given',
    },
    },
  run: runPlugin,
};