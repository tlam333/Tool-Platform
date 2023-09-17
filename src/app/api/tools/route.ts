import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;

export async function GET(request: Request, response: NextApiResponse) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || 5;
  const page = searchParams.get("page") || 1;
  var offset = searchParams.get("offset") || undefined; //this is the offset for the next page
  const sortby = searchParams.get("sort") || "UpdatedAt";
  const keyword = encodeURI((searchParams.get("keyword") || "").toLowerCase());
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
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const records = await res.records;
  offset = await res.offset; //this is the offset for the next page
  const error = await res.error;
  if (error) {
    console.error(error);
    return NextResponse.error();
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
  });
}
