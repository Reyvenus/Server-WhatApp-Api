import axios from "axios";
import { type MessageBody } from "../finish_chat_IA/finishChatIA";


export const controllerWhatsApp = async (
  API_KEY: string,
  phoneID: string,
  numberPhone: string,
  resp: string,
  message: MessageBody
): Promise<void> => {

  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v19.0/${phoneID}/messages`,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: numberPhone,
      type: "text",
      text: {
        body: resp,
      }
    },
  });

  // mark incoming message as read
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v19.0/${phoneID}/messages`,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    data: {
      messaging_product: "whatsapp",
      status: "read",
      message_id: message.id,
    },
  });
}