import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    domains: ["lh3.googleusercontent.com", "i.pravatar.cc"], // Tambahkan domain Google
  },
};

export default nextConfig;
