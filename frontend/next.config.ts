import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows importing Leaflet CSS from node_modules
  transpilePackages: ["leaflet"],
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "https://climate-resilience-backend-hnry.onrender.com",
    NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS ?? "false",
  },
};

export default nextConfig;
