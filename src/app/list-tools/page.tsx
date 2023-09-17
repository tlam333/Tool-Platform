import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  other: { "og:url": "https://sharetools.lpages.co/list-tools/" },
};

export default async function ListTools() {
  return (
    <>
      <link rel="opengraph" href="https://sharetools.lpages.co/list-tools/" />
      <Script src="//sharetools.lpages.co/_/js/list-tools/"></Script>
    </>
  );
}
