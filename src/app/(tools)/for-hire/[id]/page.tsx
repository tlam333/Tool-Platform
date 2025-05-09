import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getToolById, getAllTools } from "@/lib/services/Tools.services";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { getMetadata } from "@/lib/services/Seo.services";
import Script from "next/script";
export const dynamic = "force-static";

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

export default async function ToolDetailsPage({
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

  if (error == "NOT_FOUND") {
    return notFound();
  }

  const productJsonLd = {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${tool.name}",
      "image": [${tool.images.map((image: string) => `"${image}"`)}],
      "description": "${tool.description?.replace(/[\n\r]/g, " ")}",
      "sku": "${tool.id}",
      "brand": {
          "@type": "Brand",
          "name": "${tool.brand}"
        },
      "offers": {
        "@type": "Offer",
        "price": ${tool.rent},
        "priceCurrency": "AUD",
        "availability": "https://schema.org/InStock"
      }
    }`,
  };

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={productJsonLd}
        id="faq-jsonld"
      />
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
            <li>{tool.name}</li>
          </ul>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-evenly">
          <div className="mx-auto lg:w-1/2">
            <div className="carousel rounded-box">
              <div className="carousel-item" key="0">
                <Image
                  width={375}
                  height={256}
                  src={tool.images[0]}
                  priority={true}
                  style={{
                    width: "auto",
                    border: "1px solid #ffffff",
                  }}
                  alt={`tool image-0`}
                  placeholder="blur"
                  blurDataURL={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P/+EQAFxwLSC8o+/gAAAABJRU5ErkJggg=="
                  }
                ></Image>
              </div>
              {tool.images.length > 1 &&
                tool.images?.map((image: string, index: number) => (
                  <div className="carousel-item" key={image}>
                    <Image
                      width={375}
                      height={256}
                      src={image}
                      style={{
                        width: "auto",
                        border: "1px solid #ffffff",
                      }}
                      alt={`tool image-${index}`}
                      placeholder="blur"
                      blurDataURL={
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P/+EQAFxwLSC8o+/gAAAABJRU5ErkJggg=="
                      }
                    />
                  </div>
                ))}
            </div>
            <div className="my-5 text-center">
              <Link
                className="btn btn-secondary btn-wide"
                href={`./${urlPath}/hire-now`}
              >
                Hire Now
              </Link>
            </div>
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
        <div className="m-2 md:mx-5 lg:mx-0">
          <div style={{ whiteSpace: "pre-wrap" }}>
            <Balancer>{tool.description}</Balancer>
          </div>
        </div>
      </div>
    </>
  );
}

//this portion forces startic generation of all tools pages
export async function generateStaticParams() {
  const toolsPage: Promise<ToolsPage> = getAllTools({ limit: "100" });
  const { tools } = await toolsPage;

  return tools.map((tool) => {
    id: tool.id + "-" + encodeURI(tool.name.replace(/ /g, "-").toLowerCase());
  });
}
