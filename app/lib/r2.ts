// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// const R2 = new S3Client({
//   region: "auto",
//   endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
//   },
// });

// export async function uploadImageToR2(file: File): Promise<string> {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   const fileExtension = file.name.split(".").pop();
//   const fileName = `${uuidv4()}.${fileExtension}`;

//   await R2.send(
//     new PutObjectCommand({
//       Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
//       Key: fileName,
//       Body: buffer,
//       ContentType: file.type,
//     })
//   );

//   // return `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${fileName}`;
// return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
// }

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToR2(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
}

export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  try {
    let fileName = '';
    if (imageUrl.includes('r2.dev')) {
      const url = new URL(imageUrl);
      fileName = url.pathname.substring(1);
    } else if (imageUrl.includes('r2.cloudflarestorage.com')) {
      const parts = imageUrl.split('/');
      fileName = parts[parts.length - 1];
    } else {
      const url = new URL(imageUrl);
      fileName = url.pathname.split('/').pop() || '';
    }
    
    if (!fileName) {
      console.error("Could not extract filename from URL:", imageUrl);
      return;
    }
    
    console.log("Attempting to delete file:", fileName);
    
    await R2.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: fileName,
      })
    );
    
    console.log("Successfully deleted file:", fileName);
  } catch (error) {
    console.error("Error deleting image from R2:", error);
    console.error("Failed to delete file:", imageUrl);
  }
}