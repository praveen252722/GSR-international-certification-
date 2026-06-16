import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd()
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "gsr-international-certification.vercel.app" }],
        destination: "https://www.gsrinternationalcertifications.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
