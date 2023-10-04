import { Metadata } from "next";
import { getMetadata } from "@/lib/services/Seo.services";
import AddTools from "@/components/tools/AddTools";
import Balancer from "react-wrap-balancer";
import Image from "next/image";

interface Props {
  user?: string;
}

export const metadata: Metadata = {
  title: "Nearby Tools & Equipment List For Hire",
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
        <div className="text-center lg:text-left">
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
            src="/image-placeholder.png"
            alt="hero image"
            width={500}
            height={500}
            className="hidden lg:block"
          />
        </div>
        {/* <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="email"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="text"
                placeholder="password"
                className="input input-bordered"
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </div>
        </div> */}
        <div className="card w-full max-w-2md shadow-2xl bg-base-100">
          <AddTools />
        </div>
      </div>
    </div>
  );
}
