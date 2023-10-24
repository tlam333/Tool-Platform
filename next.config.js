/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
        port: '',
        pathname: '/v1/**',
      },
      {
        protocol: 'https',
        hostname: 'nearbytools-public.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
    config.externals.push({
        '@aws-sdk/signature-v4-multi-region': 'commonjs @aws-sdk/signature-v4-multi-region',
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/for-rent',
        destination: '/for-hire',
        permanent: true,
      },
      {
        source: '/list-tools',
        destination: '/list-for-hire',
        permanent: true,
      },
    ]
  },
};
  
module.exports = nextConfig;
  