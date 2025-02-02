/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
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
