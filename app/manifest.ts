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
    icons: [
      // Core required icons (no purpose = defaults to 'any')
      { src: "/android-192x192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },

      // Larger fallback icons (no purpose = 'any')
      { src: "/android-363x363.png", sizes: "363x363", type: "image/png" },
      { src: "/android-484x484.png", sizes: "484x484", type: "image/png" },
      { src: "/android-727x727.png", sizes: "727x727", type: "image/png" },
      { src: "/android-969x969.png", sizes: "969x969", type: "image/png" },
      { src: "/android-1144x1144.png", sizes: "1144x1144", type: "image/png" },

      // Maskable-specific icons (for modern adaptive shapes)
      {
        src: "/android-chrome-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable" as const, // ← TS-safe single value
      },
      {
        src: "/android-chrome-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable" as const, // ← TS-safe single value
      },

      // Fallback for platforms that need non-masked (purpose: 'any' is default, so omit it)
      {
        src: "/android-chrome-512x512.png", // Use your non-maskable 512x512 as fallback
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
