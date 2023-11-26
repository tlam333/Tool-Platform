import { NextRequest, NextResponse } from "next/server";
import { imageUrl } from "@/lib/constants";
const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
var airtableApiUrl = `${apiURL}/${baseId}/Tools`;
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || 20;
  const page = searchParams.get("page") || 1;
  var offset = searchParams.get("offset") || undefined; //this is the offset for the next page
  const sortby = searchParams.get("sort") || "UpdatedAt";
  const categories = searchParams.get("categories")?.toLowerCase() || undefined;
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
  var url1 = `${airtableApiUrl}?pageSize=${limit}`;
  if (offset) {
    url1 = url1 + `&offset=${offset}`;
  }
  if (sortby) {
    url1 = url1 + `&sort[0][field]=${sortby}&sort[0][direction]=desc`;
  }

  var filterByFormula = "";
  if (location || keyword || categories) {
    filterByFormula = `&filterByFormula=AND(`;
    if (location) {
      filterByFormula = `${filterByFormula}FIND('${location}',LOWER(ARRAYJOIN(Suburb)))`;
    } else {
      filterByFormula = `${filterByFormula}1`;
    }
    if (keyword) {
      filterByFormula = `${filterByFormula},FIND('${keyword}',LOWER({Product Name}))`;
    }
    if (categories) {
      filterByFormula = `${filterByFormula},FIND(LOWER({Tool Category}),'${categories}')`;
    }
    filterByFormula = `${filterByFormula})`;
  }

  if (filterByFormula) {
    url1 = url1 + `${filterByFormula}`;
  }
  url1 = encodeURI(url1);

  const res = await fetch(url1, {
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
    if (categories) {
      redirect.searchParams.set("categories", categories);
    }
    redirect.searchParams.set(
      "message",
      "Data expired, showing the first page results."
    );
    const newReq: NextRequest = new NextRequest(redirect.href, request);

    return GET(newReq, response);
  }

  const tools: Tool[] = await records.map((record: any) => ({
    id: record.id,
    name: record.fields["Product Name"],
    brand: record.fields["Brand Name"],
    description: record.fields["Description"],
    rent: record.fields["Rental fee"],
    duration: record.fields["Rental fee duration"],
    images: record.fields["Image_files"]
      ?.split(",")
      .map((image: string) => imageUrl + image),
    location: record.fields["Suburb"],
    category: record.fields["Tool Category"],
    owner: record.fields["Email"],
    delivery: record.fields["Delivery"],
    deliveryFee: record.fields["DeliveryFee"],
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

  const imageList = images?.toString().replace(/[\n\r]/g, "");
  var message = "Tool created successfully.";
  const res = await fetch(airtableApiUrl, {
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
            Image_files: imageList,
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

/**update tools*/
export async function PUT(request: NextRequest, response: NextResponse) {
  const {
    id,
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

  const imageList = images?.toString().replace(/[\n\r]/g, "");
  var message = "Tool updated successfully.";
  const res = await fetch(airtableApiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      records: [
        {
          id: id,
          fields: {
            "Product Name": name,
            "Brand Name": brand,
            Description: description,
            "Rental fee": rent,
            "Rental fee duration": duration,
            "Security Deposit": deposit,
            Image_files: imageList,
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

  //revalidate the cache for this product
  revalidatePath("/for-hire/" + id);
  return NextResponse.json({
    message: message,
    id: res?.records[0]?.id,
  });
}
