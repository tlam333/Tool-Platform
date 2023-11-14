import { MetadataRoute } from "next";
import { getAllProductPaths } from "./api/tools/util";
const siteUrl = process.env.NEXT_PUBLIC_URL;

type pageEntry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //get all the product ids and names from the database
  const { productPaths } = await getAllProductPaths();
  const productPages: pageEntry[] = await productPaths.map((productPath) => {
    return {
      url: `${siteUrl}/for-hire/${productPath.path}`,
      lastModified: productPath.updatedAt
        ? new Date(productPath.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    };
  });

  return [
    {
      url: siteUrl || "https://nearbytools.com.au",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/for-hire`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/list-for-hire`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productPages,
  ];
}
