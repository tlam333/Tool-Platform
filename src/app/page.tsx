/**This is home page */
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  other: { "og:url": "https://sharetools.lpages.co/tools4hire-landing-page/" },
};

export default async function Home() {
  return (
    <>
      <link
        rel="opengraph"
        href="https://sharetools.lpages.co/tools4hire-landing-page/"
      />
      <Script src="//sharetools.lpages.co/_/js/tools4hire-landing-page/"></Script>
    </>
  );
}
