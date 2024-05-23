import { CreateBucketCommand, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { bucket, s3Client } from "./config";


export const s3_AudioUp = async (data: any, audioID: string, phone: string): Promise<void> => {
  const bucketName = `${bucket}-${phone}`
  console.log("BUCKET", bucketName)

  const command = new ListBucketsCommand({});
  const { Buckets } = await s3Client.send(command);

  if (Buckets) {
    for (const bucket of Buckets) {
      if (!bucket?.Name?.includes(bucketName)) {
        await s3Client.send(
          new CreateBucketCommand({
            Bucket: bucketName,
          })
        );
      }
    };
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: `audio-${audioID}`,
        Body: data
      },
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log("PROGRESS", progress);
    });

    await parallelUploads3.done();

    // await s3Client.send(
    //   new PutObjectCommand({
    //     Bucket: bucketName,
    //     Key: audioID,
    //     Body: data,
    //   })
    // );
  };
};

