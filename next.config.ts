import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Autoriser les photos Wikipedia / Wikimedia Commons (haute résolution
    // optimisée auto en WebP/AVIF par next/image).
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
    ],
  },
};

export default nextConfig;
