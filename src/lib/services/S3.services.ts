import { NextResponse } from "next/server";
import { formatUrl } from "@aws-sdk/util-format-url";

const maxFileSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE;

export async function uploadFile(file: File): Promise<string> {
  if (file == null) {
    return "No file selected";
  } else if (file.size > Number(maxFileSize)) {
    return "Image max size should be less than 5MB";
  }
  /** get signed url */
  const fileName = encodeURIComponent(file.name.replace(/\s+/g, "-"));
  const fileType = encodeURIComponent(file.type);
  const signedUrl = await fetch(
    `/api/signedUrl?fileName=${fileName}&fileType=${fileType}`
  );
  const { url, key } = await signedUrl.json();
  /** Upload file to the signed url */

  await fetch(url, {
    method: "PUT",
    body: file,
  })
    .then((res) => {
      return url.split("?")[0];
    })
    .catch((err) => {
      console.error(err);
      return "Error uploading file";
    });

  return key;
}

export async function deleteFile(key: string): Promise<string> {
  const res = await fetch(`/api/signedUrl?key=${key}`, { method: "DELETE" });
  const { message } = await res.json();
  return message;
}
