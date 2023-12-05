"use client";
import Script from "next/script";
import { pageview } from "@/lib/gtm";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function GoogleTagManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  return (
    <>
      <>
        <noscript>
          <iframe
            id="gtmFrame"
            src={`https://www.googletagmanager.com/ns.html?id='+${GTM_ID}+'`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
                var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
                j.async = true;
                j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                f.parentNode.insertBefore(j, f);
                })(window, document, "script", "dataLayer", '${GTM_ID}');
                `,
          }}
        />
      </>
    </>
  );
}
