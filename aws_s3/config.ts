import { S3Client } from "@aws-sdk/client-s3";


export const bucket = "audio-whatsapp";

export const s3Client = new S3Client(
  {
    region: `${process.env.AWS_REGION}`,
    credentials: {
      accessKeyId: `${process.env.ACCES_KEY}`,
      secretAccessKey: `${process.env.SECRET_KEY}`
    }
  }
);
