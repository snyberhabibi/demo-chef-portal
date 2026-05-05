import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3htxyn6qgrjnm.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wrccwjnhxyxqqkdrnrrr.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "54321",
        pathname: "/**",
      },
    ],
    qualities: [75, 85, 95],
  },
};

export default nextConfig;
