import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "upbeat-stoat-959.convex.cloud", protocol: "https" },
      { hostname: "beaming-dove-640.convex.site", protocol: "https" },
    ],
  },
};

export default nextConfig;
