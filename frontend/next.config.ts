import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // async rewrites() {
  //   return {
  //     // 🟢 Checks if a frontend page matches FIRST before running the backend proxy
  //     beforeFiles: [
  //       {
  //         source: "/frc/:path*",
  //         destination: "http://localhost:5000/frc/:path*",
  //       },
  //     ],
  //   };
  // },
};

export default nextConfig;
