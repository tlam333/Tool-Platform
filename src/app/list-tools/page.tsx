import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  other: { "og:url": "https://www.nearbytools.com.au/list-tools/" },
};

export default async function ListTools() {
  return (
    <>
      <link
        rel="opengraph"
        href="https://www.nearbytools.com.au/list-tools//"
      />
      <Script src="//www.nearbytools.com.au/_/js/list-tools/"></Script>
    </>
  );
}
