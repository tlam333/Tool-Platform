import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const expiresIn = process.env.AWS_S3_URL_EXPIRATION;
const s3Configuration: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName") || "empty";
  const fileType = searchParams.get("fileType") || "empty";

  const randomID = Math.random() * 10000000;
  const key = `${randomID}-${encodeURIComponent(fileName)}`;

  const client = new S3Client(s3Configuration);

  // Get signed URL from S3
  const params = {
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
  };
  const command = new PutObjectCommand(params);

  try {
    const res = await getSignedUrl(client, command, {
      expiresIn: Number(expiresIn),
    });
    return NextResponse.json({ url: res, key: key });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      error: "Error geting signed S3 url to upload file, please check logs",
    });
  }
}
/**
 *
 * @param req - key is the file name
 * @returns ok 200
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") || "empty";
  if (key === "empty") return NextResponse.json({ message: "Invalid key" });

  const client = new S3Client(s3Configuration);

  const params = {
    Bucket: bucket,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);

  try {
    const res = await client.send(command);
    return NextResponse.json({ message: "Deleted successfuly" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: "Error deleting file from S3, please check logs",
    });
  }
}
