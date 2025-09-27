import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@modules": path.resolve(__dirname, "modules"),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
