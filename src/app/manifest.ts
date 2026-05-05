import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yalla Bites — Chef Portal",
    short_name: "Chef Portal",
    description:
      "Manage your kitchen, menu, orders, and flash sales — all in one place.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#331f2e",
    orientation: "portrait-primary",
    categories: ["food", "business", "productivity"],
    icons: [
      {
        src: "/icons/icon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/icon-384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
