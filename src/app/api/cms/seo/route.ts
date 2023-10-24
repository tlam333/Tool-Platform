import { NextResponse, NextRequest } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;
var url = `${apiURL}/${process.env.BASE_ID}/SEO`;

export async function GET(req: NextRequest) {
  const title = "Nearby Tools - Tool & Equipment Rental Marketplace";
  const description =
    "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!";

  const ogType = "website";
  const ogUrl = "https://nearbytools.com.au";
  const ogTitle = "Nearby Tools - Tool & Equipment Rental Marketplace";
  const ogDescription =
    "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!";
  const siteName = "Nearby Tools";
  const ogImage = "https://nearbytools.com.au/icon.png";

  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl") || undefined;
  const category = searchParams.get("category") || undefined;
  var filterByFormula = ``;
  if (pageUrl && category) {
    filterByFormula = `filterByFormula=AND(FIND(LOWER('${pageUrl}')%2C+LOWER(pageUrl))%2C+FIND(LOWER('${category}')%2C+LOWER(category))%0A)`;
  } else if (pageUrl) {
    filterByFormula = `filterByFormula=FIND(LOWER('${pageUrl}')%2C+LOWER(pageUrl))`;
  } else if (category) {
    filterByFormula = `filterByFormula=FIND(LOWER('${category}')%2C+LOWER(category))`;
  } else {
    return NextResponse.json({
      title,
      description,
      ogType,
      siteName,
      ogTitle,
      ogDescription,
      ogUrl,
      ogImage,
    });
  }

  const url1 = `${url}?${filterByFormula}`;

  const res = await fetch(url1, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const records = await res.records;

  const error = await res.error;

  const { title: metaTitle, metaDescription } = await records[0].fields;

  return NextResponse.json({
    title: metaTitle,
    description: metaDescription,
    ogType,
    siteName,
    ogTitle: metaTitle,
    ogDescription: metaDescription,
    ogUrl,
    ogImage,
  });
}
