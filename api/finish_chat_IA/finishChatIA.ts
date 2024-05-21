import axios from "axios";


export type Message = {
  message: MessageBody;
};
export type MessageChat = {
  message: Text;
};

export type MessageBody = {
  from: string;
  id: string;
  timestamp: string;
  type: "audio" | "text";
  text?: Text;
  audio?: Audio
};

export type Text = {
  body: string;
};

export type Audio = {
  mime_type: string,
  sha256: string,
  id: string,
  voice: boolean
};


export const finishChatIA = async (urlIA: string, body: MessageChat) => {
  try {
    const response = await axios(urlIA, {
      method: "POST",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "MIDDLEWARE": "acces-middleware"
      }
    });
    return response.data;

  } catch (error: any) {
    throw new Error(error.message);
  }
};