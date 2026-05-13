/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
  // Increase the limit for all server components / route handlers
  serverExternalPackages: [],
};

export default nextConfig;
