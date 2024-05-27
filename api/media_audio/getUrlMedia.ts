import axios from "axios"


export type DataMedia = {
  url:               string;
  mime_type:         string;
  sha256:            string;
  file_size:         number;
  id:                string;
  messaging_product: string;
};

export const getUrlMedia = async (MEDIA_ID: string) => {
  try {
    const response = await axios(`https://graph.facebook.com/v19.0/${MEDIA_ID}`, {
      headers: {
        "Authorization": `Bearer ${process.env.GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      }
    });

    return response.data as DataMedia

  } catch (error: any) {
    return error.message;
  }
};
