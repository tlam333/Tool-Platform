import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";

export const metadata = {
  title: "Nearby Tools - and Equipment Rental Marketplace",
  description:
    "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!",
  openGraph: {
    type: "website",
    url: "https://nearbytools.com.au",
    title: "Nearby Tools - Tool & Equipment Rental Marketplace",
    description:
      "A platform for renting tools and equipment from your neighbours. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!",
    siteName: "Nearby Tools",
    images: [
      {
        url: "https://nearbytools.com.au/icon.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nearby Tools - Hire tools & Equipment from your neighbours",
    description:
      "A platform for renting tools and equipment from your neighbors. For a cost-effective, sustainable solutions to your projects & DIY, Join the sharing revolution today!",
    creator: "@nearbytools",
  },
  metadataBase: new URL("https://nearbytools.com.au"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={cx(sfPro.variable, inter.variable)}>
        <GoogleTagManager />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pt-20 ">
          {children}
        </main>
        <Footer />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
