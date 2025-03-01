import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  }
  // images: {
  //   domains: ["storage.yandexcloud.net", "i.pinimg.com"],
  // },
};

export default nextConfig;
;
