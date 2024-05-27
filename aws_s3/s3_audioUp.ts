import { CreateBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "./config";
import { createAndVerifyBucket } from "./createBucket";


export const s3_AudioUp = async (data: any, audioID: string, phone: string): Promise<void> => {
  const bucketName = `${process.env.BUCKET_NAME}`
  const command = new ListBucketsCommand({});
  const { Buckets } = await s3Client.send(command);

  await createAndVerifyBucket(Buckets, bucketName)

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: `${phone}/audios/${audioID}.ogg`,
      Body: data,
      ContentType: "ogg",
    },
  });

  parallelUploads3.on("httpUploadProgress", (progress) => {
    console.log("PROGRESS", progress);
  });

  await parallelUploads3.done();
};

// await s3Client.send(
//   new PutObjectCommand({
//     Bucket: bucketName,
//     Key: audioID,
//     Body: data,
//   })
// );


