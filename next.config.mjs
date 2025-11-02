/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows any https hostname
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Matches all /api/ paths
        destination: "https://nextecomm.netlify.app/api/:path*", // Proxies them to Netlify
      },
    ];
  },
};

export default nextConfig;
