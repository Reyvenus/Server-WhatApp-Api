import { createInterface } from "readline/promises";
import { s3Client } from "./config";
import { DeleteBucketCommand, DeleteObjectCommand, paginateListObjectsV2 } from "@aws-sdk/client-s3";


export const emptyBucket = async () => {
  try {
    // Confirm resource deletion.
    const prompt = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const result = await prompt.question("Empty and delete bucket? (y/n) ");
    prompt.close();

    if (result === "y") {
      // Create an async iterator over lists of objects in a bucket.
      const paginator = paginateListObjectsV2(
        { client: s3Client },
        { Bucket: `${process.env.BUCKET_NAME}` }
      );

      console.log("paginator", paginator)
      for await (const page of paginator) {
        const objects = page.Contents;
        console.log("objects", objects)
        if (objects) {
          // For every object in each page, delete it.
          for (const object of objects) {
            await s3Client.send(
              new DeleteObjectCommand({ Bucket: `${process.env.BUCKET_NAME}`, Key: object.Key })
            );
          }
        }
      }
    }
    // Once all the objects are gone, the bucket can be deleted.
    await s3Client.send(new DeleteBucketCommand({ Bucket: `${process.env.BUCKET_NAME}` }));
  } catch (error: any) {
    console.log(error.message)
  }
}

// emptyBucket().then()