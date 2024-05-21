import axios from "axios"


export const getUrlMediaAudio = async (MEDIA_ID: string) => {
  try {
    const response = await axios(`https://graph.facebook.com/v19.0/${MEDIA_ID}`, {
      headers: {
        "Authorization": `Bearer ${process.env.GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      }
    });

    return response.data

  } catch (error: any) {
    return error.message;
  }
};
