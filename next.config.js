/** @type {import('next').NextConfig} */
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:3001';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiTarget}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
