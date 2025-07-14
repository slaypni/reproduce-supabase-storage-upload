"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const getS3Client = () =>
  new S3Client({
    endpoint: "http://127.0.0.1:54321/storage/v1/s3",
    region: "local",
    credentials: {
      accessKeyId: "YOUR_ACCESS_KEY_ID",
      secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
    },
    forcePathStyle: true,
  });

export const getChatFileUploadUrl = async (fileName: string) => {
  const client = getS3Client();
  const presignedPost = await createPresignedPost(client, {
    Bucket: "chat",
    Key: `${fileName}`,
    Expires: 60,
    Fields: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "max-age=3600",
    },
  });
  return presignedPost;
};
