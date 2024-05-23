import axios from "axios"


export const audioTrasncription = async (body: any) => {
  try {
    const response = await axios(`http://localhost:8000/api/atranscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/octet-stream",
          "MIDDLEWARE": "acces-middleware"
        },
        data: body
      });

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
