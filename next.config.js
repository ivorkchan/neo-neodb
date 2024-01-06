/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'neodb.social',
      },
    ],
  },
}

module.exports = nextConfig
