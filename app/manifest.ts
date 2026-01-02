// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GPA Calculator",
    short_name: "GPA Calc",
    description: "Calculate your semester & cumulative GPA instantly",
    start_url: "/gpa", // Opens here on icon tap
    scope: "/", // Keeps login redirects inside PWA
    display: "standalone",
    background_color: "#ffffff",
    orientation: "portrait-primary",
    // app/manifest.ts   ← ONLY CHANGE THESE LINES
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#ffffff",
  };
}
