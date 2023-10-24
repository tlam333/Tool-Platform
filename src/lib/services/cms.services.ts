import { NextResponse } from "next/server";
import { cache } from "react";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllFaq() {
  const payloadUrl = `${apiURL}/cms/faq`;

  const res = await fetch(`${payloadUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    //next: { revalidate: 60 },
    //cache: "no-store",
  });
  if (!res.ok) {
    return undefined;
  }

  return await res.json();
}
