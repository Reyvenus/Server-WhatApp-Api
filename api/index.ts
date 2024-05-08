import axios from "axios"
import express, { Application, Request, Response } from "express"
import 'dotenv/config'


const app: Application = express()
app.use(express.json())

app.get("/oloraboca", (req: Request, res: Response) => {
  res.send("putito*");
});

const {
  WEBHOOK_VERIFY_TOKEN,
  GRAPH_API_TOKEN, PORT,
  BUSINESS_PHONE_NUMBER_ID,
  URL_API_OPENAI_STREAM
} = process.env;

app.post("/webhook", async (req: Request, res: Response) => {
  // console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message && message.text && message.text.body) {
    const body = { message: message.text.body };

    if (message?.type === "text") {
      const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      const response = await axios(`${URL_API_OPENAI_STREAM}`, {
        method: "POST",
        data: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "MIDDLEWARE": "acces-middleware"
        }
      })
      const numberCel = message.from
      const indiceAEliminar = 2
      const newNumberCel = numberCel.slice(0, indiceAEliminar) + numberCel.slice(indiceAEliminar + 1);
      console.log("SIN", newNumberCel)

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v19.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: newNumberCel.toString(),
          type: "text",
          text: {
            // preview_url: "",
            body: response.data.toString(),
          }
          // template: {
          //   name: "hello_world",
          //   language: {
          //     code: "en_US"
          //   }
          // }
        },
      });

      // mark incoming message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v19.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    }
    res.sendStatus(200);
    res.end()
  }
  res.end()
  return
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

export default app