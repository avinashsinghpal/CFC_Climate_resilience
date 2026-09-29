import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows importing Leaflet CSS from node_modules
  transpilePackages: ["leaflet"],
};

export default nextConfig;
