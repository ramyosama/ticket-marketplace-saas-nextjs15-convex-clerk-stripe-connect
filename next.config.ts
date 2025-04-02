import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "precise-roadrunner-932.convex.cloud", protocol: "https" },
      { hostname: "beaming-dove-640.convex.cloud", protocol: "https" },
      { hostname: "ticket-master-nine.vercel.app", protocol: "https" },
    ],
  },
};

export default nextConfig;
