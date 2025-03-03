import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    domains: ['vercel.com'],
  },
  webpack: (config) => {
    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
