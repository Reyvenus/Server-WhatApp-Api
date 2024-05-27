import { CreateBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./config";


export const createAndVerifyBucket = async (buckets: any, bucketName: string) => {
  try {
    if (buckets.lenght > 0) {
      for (const bucket of buckets) {
        if (!bucket?.Name?.includes(bucketName)) {
          await s3Client.send(
            new CreateBucketCommand({
              Bucket: bucketName,
            })
          );
        }
      };
    }
    else {
      await s3Client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );
    }
  } catch (error: any) {
    throw new (error.message)
  }
};