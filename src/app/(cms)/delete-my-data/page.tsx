import { getMetadata } from "@/lib/services/Seo.services";
import { processRichText } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = await getMetadata("/delete-my-data");
  return metadata;
}

export default async function DeleteMyData() {
  const url = `${process.env.AIRTABLE_API_URL}/${process.env.BASE_ID}/Legal?filterByFormula=LOWER('delete-my-data')%3DLOWER(name)`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const error = await res.error;
  if (error) {
    console.log("Error while fetching delete my data page-", error);
  }
  const records = await res.records;
  const { heading, description, updatedAt } = records[0].fields;
  const privacyData = { __html: processRichText(description || "") };

  return (
    <div className="px-2 md:px-2 lg:px-10 xl:px-20 w-full min-h-screen">
      <div className="mx-auto max-w-5xl py-10">
        <h1 className="py-5 text-2xl">{heading}</h1>
        <div className="m-2 md:mx-5 lg:mx-0">
          <div
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={privacyData}
          ></div>
          {updatedAt && (
            <div>
              Last updated - {new Date(updatedAt).toLocaleDateString("en-GB")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
