/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://telexph-admin.onrender.com/api/:path*',
      },
    ];
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;