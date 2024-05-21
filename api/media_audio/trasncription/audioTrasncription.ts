import axios from "axios"


export const audioTrasncription = async (datos: any) => {
  try {
    const response = await axios.post(`${process.env.URL_API_OPENAI_TRANSCRIPTION}`, datos,
      {
        // method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "MIDDLEWARE": "acces-middleware"
        },
      });

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
