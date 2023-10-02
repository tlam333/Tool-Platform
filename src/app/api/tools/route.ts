import { NextRequest, NextResponse } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
import sgMail from "@sendgrid/mail";
var url = `${apiURL}/${baseId}/Tools`;

export async function GET(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || 5;
  const page = searchParams.get("page") || 1;
  var offset = searchParams.get("offset") || undefined; //this is the offset for the next page
  const sortby = searchParams.get("sort") || "UpdatedAt";
  const keyword = encodeURI((searchParams.get("keyword") || "").toLowerCase());
  var message = searchParams.get("message") || "";
  const location = encodeURI(
    (searchParams.get("location") || "").toLowerCase()
  );

  /** accepted params by airtable
   * maxRecords:Number
   * fields:Array
   * filterByFormula:string
   * pageSize:Number
   * sort:Array
   * view:string
   * These parameters need to be URL encoded.
   */
  var url = `${apiURL}/${process.env.BASE_ID}/Tools?pageSize=${limit}`;
  if (offset) {
    url = url + `&offset=${offset}`;
  }
  if (sortby) {
    url = url + `&sort[0][field]=${sortby}&sort[0][direction]=desc`;
  }

  var filterByFormula = ``;

  if (location && keyword) {
    filterByFormula = `&filterByFormula=AND(FIND('${keyword}'%2C+LOWER(%7BProduct+Name%7D))%2C+FIND('${location}'%2C+LOWER(ARRAYJOIN(Suburb)))%0A)`;
  } else if (location) {
    filterByFormula = `&filterByFormula=FIND('${location}'%2C+LOWER(ARRAYJOIN(Suburb)))`;
  } else if (keyword) {
    filterByFormula = `&filterByFormula=FIND('${keyword}'%2C+LOWER(%7BProduct+Name%7D))`;
  }

  url = encodeURI(url);
  if (filterByFormula) {
    url = url + `${filterByFormula}`;
  }

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    //next: { revalidate: 60 },
    cache: "no-store",
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const records = await res.records;
  offset = await res.offset; //this is the offset for the next page
  const error = await res.error;
  if (error) {
    console.log(error);

    const redirect = new URL("/for-rent", request.url);
    redirect.searchParams.set("keyword", keyword);
    if (keyword) {
      redirect.searchParams.set("keyword", keyword);
    }
    if (location) {
      redirect.searchParams.set("location", location);
    }
    redirect.searchParams.set(
      "message",
      "Data expired, showing the first page results."
    );
    const newReq: NextRequest = new NextRequest(redirect.href, request);

    return GET(newReq, response);
  }

  const tools: Tool[] = await records.map((record: any) => ({
    //id: record.fields["Tool ID"],
    id: record.id,
    name: record.fields["Product Name"],
    brand: record.fields["Brand Name"],
    description: record.fields["Description"],
    rent: record.fields["Rental fee"],
    duration: record.fields["Rental fee duration"],
    images: record.fields.Images
      ? Object.assign(record.fields.Images).map((image: any) => image.url)
      : "",
    location: record.fields["Suburb"],
    category: record.fields["Tool Category"],
    owner: record.fields["Email"],
    status: record.fields["Status"],
    createdAt: record.fields["createdTime"],
    updatedAt: record.fields["createdTime"],
  }));

  return NextResponse.json({
    tools,
    pageIndex: page,
    total: tools.length,
    nextPage: offset,
    message: message,
  });
}

/**create tools*/
export async function POST(request: NextRequest, response: NextResponse) {
  const {
    name,
    brand,
    description,
    rent,
    duration,
    deposit,
    images,
    category,
    owner,
  }: Partial<Tool> = await request.json();

  const s3bucketUrl =
    "https://" +
    process.env.NEXT_PUBLIC_AWS_BUCKET_NAME +
    ".s3." +
    process.env.NEXT_PUBLIC_AWS_REGION +
    ".amazonaws.com/";

  const imageList = images
    ?.toString()
    .replace(/[\n\r]/g, "")
    .split(",")
    .map((image: any) => ({ url: s3bucketUrl + image }));
  var message = "Tool created successfully.";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            "Product Name": name,
            "Brand Name": brand,
            Description: description,
            "Rental fee": rent,
            "Rental fee duration": duration,
            "Security Deposit": deposit,
            Images: images
              ?.toString()
              .replace(/[\n\r]/g, "")
              .split(",")
              .map((image: any) => ({ url: s3bucketUrl + image })),
            "Tool Category": category,
            Email: [owner],
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .catch((err) => {
      console.error(err);
      message = err;
    });
  return NextResponse.json({
    message: message,
    id: res?.records[0]?.id,
  });
}
