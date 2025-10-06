import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com"], // 👈 allow Clerk avatars
  },
};

export default nextConfig;
