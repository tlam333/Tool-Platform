import { Metadata } from "next";
import { getMetadata } from "@/lib/services/Seo.services";
import AddTools from "@/components/tools/AddTools";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import imageCreative from "@/public/ListToolsCreative.png";

interface Props {
  user?: string;
}

export const metadata: Metadata = {
  title: "Nearby Tools - and Equipment List For Hire",
  description:
    "List your tools and equipment for hire on Nearby Tools. Make your tools work for you!",
};

//export const metadat: Promise<Metadata> = getMetadata("/list-for-hire");

// export async function generateMetadata(): Promise<Metadata> {
//   const metadata: Metadata = await getMetadata("/list-for-hire");
//   return metadata;
// }

export default async function ListForHire({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row items-start mt-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold">
            List your Tools & Equipment for Hire!
          </h1>
          <p className="py-6">
            <Balancer>
              Make your tools and equipment work for you! List them on Nearby
              Tools now and start earning!
            </Balancer>
          </p>
          <Image
            src={imageCreative}
            alt="hero image"
            priority={true}
            className="hidden lg:block"
            width={450}
            height={480}
            style={{ width: "auto" }}
          />
        </div>
        <div className="card w-full max-w-2md shadow-2xl bg-base-100">
          <AddTools />
        </div>
      </div>
    </div>
  );
}
