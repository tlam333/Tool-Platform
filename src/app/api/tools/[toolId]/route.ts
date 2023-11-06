import { NextRequest, NextResponse } from "next/server";
import { imageUrl } from "@/lib/constants";

var airtableApiUrl = `${process.env.AIRTABLE_API_URL}/${process.env.BASE_ID}/Tools`;

export async function GET(request: NextRequest, context: any) {
  const toolId = context.params.toolId;

  if (!toolId) {
    return NextResponse.json(
      { message: "toolId is required" },
      { status: 400 }
    );
  }
  const resp = getToolData(toolId);

  const { error } = await resp;

  const { tool } = await resp;

  return NextResponse.json({ error: error, tool: tool });
}

export async function getToolData(toolId: string) {
  const res = await fetch(airtableApiUrl + "/" + toolId, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    next: { tags: [toolId] },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
  const { error } = await res;

  if (error) {
    return { error: error };
  }

  const record = await res;
  const tool: Tool = await {
    id: record.id,
    name: record.fields["Product Name"],
    rent: record.fields["Rental fee"],
    deposit: record.fields["Security Deposit"],
    duration: record.fields["Rental fee duration"],
    brand: record.fields["Brand Name"],
    description: record.fields["Description"],
    images: record.fields["Image_files"]
      ?.split(",")
      .map((image: string) => imageUrl + image),
    category: record.fields["Tool Category"],
    owner: record.fields["Email"],
    location: record.fields["Suburb"],
    status: record.fields["Status"],
    createdAt: record.fields["CreatedAt"],
    updatedAt: record.fields["UpdatedAt"],
  };
  return { tool: tool };
}
