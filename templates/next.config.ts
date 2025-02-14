import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // images: {
  //   domains: ["storage.yandexcloud.net"],
  // },
};

export default nextConfig;
