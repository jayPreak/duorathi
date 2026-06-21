import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duorathi — Learn Marathi",
    short_name: "Duorathi",
    description:
      "Learn Marathi the fun way — bite-sized daily lessons, streaks, and XP.",
    start_url: "/learn",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#58cc02",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
