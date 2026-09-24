import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is used for the app mockups so their small UI text stays crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
