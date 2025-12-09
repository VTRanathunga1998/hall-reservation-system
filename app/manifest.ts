// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hall GPA Calculator",
    short_name: "GPA Calc",
    description: "Calculate your semester & cumulative GPA instantly",
    start_url: "/gpa", // Opens here on icon tap
    scope: "/", // Keeps login redirects inside PWA
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8b5cf6", // Your brand color
    orientation: "portrait-primary",
    // app/manifest.ts   ← ONLY CHANGE THESE LINES
    icons: [
      {
        src: "/icons/android-192x192.png",
        sizes: "192x192",
        type: "image/png",
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

      // Maskable icons
      {
        src: "/icons/android-chrome-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable" as const,
      },
      {
        src: "/icons/android-chrome-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable" as const,
      },

      // All your other icons with /icons/ prefix
      {
        src: "/icons/android-363x363.png",
        sizes: "363x363",
        type: "image/png",
      },
      {
        src: "/icons/android-484x484.png",
        sizes: "484x484",
        type: "image/png",
      },
      {
        src: "/icons/android-727x727.png",
        sizes: "727x727",
        type: "image/png",
      },
      {
        src: "/icons/android-969x969.png",
        sizes: "969x969",
        type: "image/png",
      },
      {
        src: "/icons/android-1144x1144.png",
        sizes: "1144x1144",
        type: "image/png",
      },
    ],
  };
}
