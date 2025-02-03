/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/files/:path*',
        destination: 'https://utfs.io/f/:path*',
      },
    ];
  },
};

export default nextConfig;
