import express, { Application, Request, Response } from "express"
import 'dotenv/config'
import { type DataMedia, getUrlMedia } from "./media_audio/getUrlMedia";
import { quitNumber9 } from "../helper/quit9";
import { audioTrasncription } from "./media_audio/trasncription/audioTrasncription";
import { getMedia } from "./media_audio/getMedia";
import { finishChatIA, type MessageBody, type MessageChat } from "./finish_chat_IA/finishChatIA";
import { controllerWhatsApp } from "./controllerWhatsApp/controllerWhatsApp";
import { s3_AudioUp } from "../aws_s3/audio/s3_audioUp";
import { s3_ImageUp } from "../aws_s3/image/s3_imageUp";


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
  console.log("Message", message)

  const business_phone_number_id: string = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

  if (message && message?.type === "image" && message?.image && message.image?.id) {
    const phoneUser = quitNumber9(message?.from);

    const imageID: string = message.image.id;
    const dataMedia: DataMedia = await getUrlMedia(imageID);//obtengo objeto image
    const image = await getMedia(dataMedia.url);

    await s3_ImageUp(image, imageID, phoneUser, message.type)

    await controllerWhatsApp(
      `${GRAPH_API_TOKEN}`,
      business_phone_number_id,
      phoneUser,
      "Pronto actualizaremos éste servicio",
      message
    );
    res.status(200).end();
  }

  if (message && message?.type === "audio" && message?.audio && message.audio?.id) {
    const phoneUser = quitNumber9(message?.from);

    const audioID: string = message.audio.id;
    const dataMedia: DataMedia = await getUrlMedia(audioID);//obtengo objeto audio
    const audio = await getMedia(dataMedia.url);

    await s3_AudioUp(audio, audioID, phoneUser, message.type);

    const bodyAudio = { audioID, phoneUser };

    const trasncription = await audioTrasncription(bodyAudio);
    const body: MessageChat = { message: trasncription };

    const respIA: string = await finishChatIA(`${URL_API_OPENAI}`, body);

    if (respIA) {
      await controllerWhatsApp(
        `${GRAPH_API_TOKEN}`,
        business_phone_number_id,
        phoneUser,
        respIA,
        message
      );
      res.status(200).end();
    }
    else
      res.end();
  };

  if (message && message?.type === "text" && message?.text && message.text?.body) {
    const phoneUser = quitNumber9(message?.from);

    const body = { message: message.text.body } as any;
    const respIA: string = await finishChatIA(`${URL_API_OPENAI}`, body);
    console.log(phoneUser)

    if (respIA) {
      await controllerWhatsApp(
        `${GRAPH_API_TOKEN}`,
        business_phone_number_id,
        phoneUser,
        respIA,
        message
      );
      res.status(200).end();
    }
    else
      res.end();
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
