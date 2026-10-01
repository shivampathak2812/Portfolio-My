import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers
  poweredByHeader: false,
  images: {
    // Serve AVIF where supported, falling back to WebP
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
