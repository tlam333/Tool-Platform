import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

export const metadata = {
  title: "NearbyTools - Hire tools from your neighbours",
  description:
    "Revolutionise the way you access tools with our peer-to-peer platform. Get access to high-quality tools in your area, save money, and contribute to a sustainable lifestyle. Join us today!",
  twitter: {
    card: "summary_large_image",
    title: "NearbyTools - Hire tools from your neighbours",
    description:
      "Revolutionise the way you access tools with our peer-to-peer platform. Get access to high-quality tools in your area, save money, and contribute to a sustainable lifestyle. Join us today!",
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
        {/* <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" /> */}
        {/* <div className="fixed h-screen w-full" /> */}
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pt-32 ">
          {children}
        </main>
        <Footer />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
