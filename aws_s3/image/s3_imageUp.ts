import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../config";
import { createAndVerifyBucket } from "../createBucket";


export const s3_ImageUp = async (
  data: any,
  fileID: string,
  phone: string,
  typeFile: string
): Promise<void> => {

  const bucketName = `${typeFile}-${process.env.BUCKET_NAME}`
  const command = new ListBucketsCommand({});
  const { Buckets } = await s3Client.send(command);

  await createAndVerifyBucket(Buckets, bucketName, typeFile)

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: `${phone}/${typeFile}/${fileID}.jpeg`,
      Body: data,
      ContentType: "jpeg",
    },
  });

  parallelUploads3.on("httpUploadProgress", (progress) => {
    console.log("PROGRESS", progress);
  });

  await parallelUploads3.done();
};
