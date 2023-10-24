import { Metadata } from "next";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getMetadata(
  urlPath: string,
  category?: string
): Promise<Metadata> {
  var payloadUrl = `${apiURL}/cms/seo?pageUrl=${urlPath}`;
  if (category) {
    payloadUrl = `${payloadUrl}&category=${encodeURI(category)}`;
  }
  var metadata: Metadata = {};
  const defaultTitle = "Nearby Tools - Tool & Equipment Rental Marketplace";
  const defaultDescription =
    "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!";

  const ogType = "website";
  const ogUrl = "https://nearbytools.com.au";
  const ogTitle = "Nearby Tools - Tool & Equipment Rental Marketplace";
  const ogDescription =
    "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!";
  const siteName = "Nearby Tools";
  const ogImagesUrl = "https://nearbytools.com.au/icon.png";

  await fetch(payloadUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        metadata = {
          title: data?.title || defaultTitle,
          description: data?.description || defaultDescription,
          openGraph: {
            type: data?.ogType || ogType,
            siteName: data?.siteName || siteName,
            title: data?.ogTitle || ogTitle,
            description: data?.ogDescription || ogDescription,
            url: data?.ogUrl || ogUrl,
            images: [{ url: data.ogImage || ogImagesUrl }],
          },
        };
      }
    })
    .catch((err) => {
      console.error("error setting metadat for page - ", urlPath, " ", err);
    });

  return metadata;
}
