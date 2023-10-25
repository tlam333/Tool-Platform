import { NextResponse, NextRequest } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;
var url = `${apiURL}/${process.env.BASE_ID}/SEO`;

export async function GET(req: NextRequest) {
  const title = "Nearby Tools - Tool & Equipment Rental Marketplace";
  const description =
    "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!";

  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl") || undefined;
  const category = searchParams.get("category") || undefined;
  var filterByFormula = ``;
  if (pageUrl && category) {
    filterByFormula = `filterByFormula=AND(LOWER('${pageUrl}')%3DLOWER(pageUrl)%2C+LOWER('${category}')%3DLOWER(category))`;
  } else if (pageUrl) {
    filterByFormula = `filterByFormula=LOWER('${pageUrl}')%3DLOWER(pageUrl)`;
  } else if (category) {
    filterByFormula = `filterByFormula=FIND(LOWER('${category}')%3DLOWER(category))`;
  } else {
    return NextResponse.json({
      title,
      description,
    });
  }

  const url1 = `${url}?${filterByFormula}`;

  const res = await fetch(url1, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    next: { tags: [pageUrl || "/"] },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const records = await res.records;

  const error = await res.error;

  const { title: metaTitle, metaDescription } = await records[0].fields;

  return NextResponse.json({
    title: metaTitle,
    description: metaDescription,
    ogTitle: metaTitle,
    ogDescription: metaDescription,
  });
}
