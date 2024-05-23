const { DeleteBucketCommand, S3Client } = require("@aws-sdk/client-s3");


const deleteBucket = async () => {
  const s3ClientDelete = new S3Client(
    {
      region: `${process.env.AWS_REGION}`,
      credentials: {
        accessKeyId: `${process.env.ACCES_KEY}`,
        secretAccessKey: `${process.env.SECRET_KEY}`
      }
    }
  );

  const command = new DeleteBucketCommand({
    Bucket: `audio-url-whatapp`,
  });

  try {
    const response = await s3ClientDelete.send(command);
    console.log("Delete", response);
  } catch (err) {
    console.error("error_delete", err);
  }
};

deleteBucket()

