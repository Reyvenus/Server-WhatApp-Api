import express, { Application, Request, Response } from "express"
import 'dotenv/config'
import { getUrlMediaAudio } from "./media_audio/getUrlAudioMedia";
import { quitNumber9 } from "../helper/quit9";
import { audioTrasncription } from "./media_audio/trasncription/audioTrasncription";
import { getAudioMedia } from "./media_audio/getAudioMedia";
import { finishChatIA, type MessageBody, type MessageChat } from "./finish_chat_IA/finishChatIA";
import { controllerWhatsApp } from "./controllerWhatsApp/controllerWhatsApp";


const app: Application = express();
app.use(express.json());


app.get("/test", (req: Request, res: Response) => {
  res.send("WORKING*");
});

const {
  WEBHOOK_VERIFY_TOKEN,
  GRAPH_API_TOKEN,
  PORT,
  URL_API_OPENAI
} = process.env;

app.post("/webhook", async (req: Request, res: Response) => {

  const message: MessageBody = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  const business_phone_number_id: string = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

  if (message && message?.type === "audio" && message?.audio && message.audio?.id) {
    const audioID = message.audio.id;
    const dataMedia = await getUrlMediaAudio(audioID);//obtengo objeto audio
    const audio = await getAudioMedia(dataMedia.url);
    const trasncription = await audioTrasncription(audio);
    const body: MessageChat = { message: trasncription };
    const respIA: string = await finishChatIA(`${URL_API_OPENAI}`, body);

    const newNumberCel = quitNumber9(message.from);

    if (respIA) {
      await controllerWhatsApp(
        `${GRAPH_API_TOKEN}`,
        business_phone_number_id,
        newNumberCel,
        respIA,
        message
      );
      res.status(200).end();
    };
    res.end;
  };

  if (message && message?.type === "text" && message?.text && message.text?.body) {
    const body = { message: message.text.body } as any;
    const respIA: string = await finishChatIA(`${URL_API_OPENAI}`, body);
    const newNumberCel = quitNumber9(message.from);


    if (respIA) {
      await controllerWhatsApp(
        `${GRAPH_API_TOKEN}`,
        business_phone_number_id,
        newNumberCel,
        respIA,
        message
      );
      res.status(200).end();
    };
    res.end;
  };
  res.end();
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});


app.listen(PORT || "5000", async () => {
  console.log(`server running on ${PORT}`);
});
