import { Metadata } from "next";
import Script from "next/script";
import Iframe from "react-iframe";

export const metadata: Metadata = {
  title: "List Tools",
  description: "List your tools and equipment for rent",
};

export default async function ListTools({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = searchParams["email"] ?? "";

  return (
    <>
      <div className="px-2 md:px-2 lg:px-10 xl:px-20 w-full bg-base-200 min-h-screen">
        <div className="mx-auto mb-10 mt-10 gap-3 text-center max-w-5xl py-5">
          <h2 className="py-5">
            Thank You For Joining The Sharing Revolution!
          </h2>
          <h2 className="py-5">Start Adding Your Tools & Equipment</h2>
          <Script src="https://static.airtable.com/js/embed/embed_snippet_v1.js"></Script>
          <Iframe
            className="airtable-embed airtable-dynamic-height"
            url={`https://airtable.com/embed/appxA3sE2W9Z3oAyu/shry8y1WRBxyHRVOA?backgroundColor=teal&prefill_Email=${email}`}
            width="100%"
            height="1231"
            styles={{ background: "transparent", border: "1px solid #ccc" }}
            id="airtable-embed"
          ></Iframe>
        </div>
      </div>
    </>
  );
}
