import { getToolById } from "@/lib/services/Tools.services";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import HireForm from "@/components/tools/forms/HireForm";
import { MapPin } from "lucide-react";
import { getMetadata } from "@/lib/services/Seo.services";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const urlPath = params.id;
  const id = urlPath.split("-")[0];

  const toolData = getToolById(id);
  const { error, tool } = await toolData;
  if (error == "NOT_FOUND") {
    return { title: "Product not found!" };
  }
  const { name, location, category, rent, duration } = tool;
  const metadata = await getMetadata("/for-hire/id", category);

  return {
    title: eval("`" + metadata.title?.toString().replace(/`/g, "\\`") + "`"),
    description: eval(
      "`" + metadata.description?.toString().replace(/`/g, "\\`") + "`"
    ),
    openGraph: {
      siteName: metadata.openGraph?.siteName,
      title: eval(
        "`" + metadata.openGraph?.title?.toString().replace(/`/g, "\\`") + "`"
      ),
      description: eval(
        "`" +
          metadata.openGraph?.description?.toString().replace(/`/g, "\\`") +
          "`"
      ),
      url: "https://nearbytools.com.au/for-hire/" + urlPath,
      images: [{ url: tool.images[0] }],
    },
  };
}

export default async function HireNowPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const urlPath = params.id;
  const id = urlPath.split("-")[0];
  const toolData = getToolById(id);
  const { error, tool } = await toolData;
  //console.log("tool-", tool);
  if (error == "NOT_FOUND") {
    return notFound();
  }

  return (
    <div className="px-2 md:mt-10 lg:px-10 xl:px-20 w-full min-h-screen mx-auto max-w-6xl">
      <div className="text-lg breadcrumbs">
        <ul>
          <li>
            <Link href="/" className="text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link href="/for-hire" className="text-blue-600">
              Product List
            </Link>
          </li>
          <li>
            <Link href={`/for-hire/${urlPath}`} className="text-blue-600">
              {tool.name}
            </Link>
          </li>
          <li>Hire Now</li>
        </ul>
      </div>
      <div className="flex flex-col lg:flex-row items-start justify-evenly">
        <div className="my-5 p-5 bg-base-200 w-full lg:w-1/2">
          <div className="flex flex-row justify-between">
            <h2 className="font-bold">Hire Now!</h2>
            <div className="tooltip" data-tip="Close">
              <Link
                href={"./"}
                className="btn btn-sm bg-base-300 btn-circle btn-ghost"
              >
                ✕
              </Link>
            </div>
          </div>

          <HireForm tool={tool} />
        </div>
        <div className="card-body justify-between w-full lg:w-1/2">
          <h1 className="card-title">{tool.name}</h1>
          <h2 className="card-title text-lg">
            Hire Rate - ${tool.rent} {tool.duration}
          </h2>
          <h3 className="text-lg">Security Deposit - ${tool.deposit || 0}</h3>

          <div className="flex space-x-5 items-center">
            <p>
              {tool.category} by {tool.brand}
            </p>
          </div>
          <div className="card-actions justify-between align-bottom">
            <div className="flex space-x-5 items-center">
              <p>
                <MapPin color="#0078d4" />
              </p>
              <p className="text-lg">{tool.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
