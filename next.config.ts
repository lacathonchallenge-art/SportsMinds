import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholders sportifs Unsplash — à remplacer par les visuels client
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Match the Supabase bucket file size limit (100 MB)
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
