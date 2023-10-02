import { NextResponse, NextRequest } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;

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
