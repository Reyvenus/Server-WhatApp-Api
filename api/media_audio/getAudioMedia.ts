import axios from "axios"


export const getAudioMedia = async (url: string) => {
  try {
    const response = await axios(url,
      {
        headers: {
          "Authorization": `Bearer ${process.env.GRAPH_API_TOKEN}`
        },
        responseType: "stream"
      });

      console.log("typo", typeof response.data)
    return response.data

  } catch (error: any) {
    console.log("ERRORAUDIOMEDIA", error.message);
  }
};
