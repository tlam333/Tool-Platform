import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nearby Tools Hire",
    short_name: "Nearby Tools",
    description: "Nearby Tools is a marketplace for tools and equipment hire.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "96x96",
        type: "image/x-icon",
      },
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-icon.png",
        sizes: "180x180",
      },
      {
        src: "/icons/icon-16x-16.png",
      },
      {
        src: "/icons/icon-32x32.png",
      },
    ],
  };
}
