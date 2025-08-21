import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Make sure bucket exists
minioClient.bucketExists(process.env.MINIO_BUCKET, function(err, exists) {
  if (err) return console.error(err);
  if (!exists) {
    minioClient.makeBucket(process.env.MINIO_BUCKET, (err) => {
      if (err) return console.error(err);
      console.log(`Bucket created: ${process.env.MINIO_BUCKET}`);
    });
  }
});
