import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.14", "*.local", "192.168.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.promediateknologi.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
