import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { loadConfig } from "../config/loadConfig.js";
import { ApiError } from "./ApiError.js";
import crypto from "crypto";

const secret = await loadConfig();

const s3Client = new S3Client({
  region: secret.AWS_REGION,
  credentials: {
    accessKeyId: secret.AWS_ACCESS_KEY_ID,
    secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
  },
});

export const deleteObject = async (fileUrlOrKey) => {
  try {
    // Extract key from URL if full URL provided
    const key = fileUrlOrKey.includes("amazonaws.com")
      ? fileUrlOrKey.split(".com/")[1]
      : fileUrlOrKey;

    const params = {
      Bucket: secret.AWS_BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("S3 deletion error:", error);
    throw new ApiError(500, `Failed to delete file: ${error.message}`);
  }
};

export const uploadBase64ToS3 = async (base64String) => {
  try {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `qrcodes/${Date.now()}${crypto.randomBytes(16).toString("hex")}-qrcode.png`;

    const params = {
      Bucket: secret.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/png",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${secret.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading QR Code:", error);
    throw error;
  }
};
