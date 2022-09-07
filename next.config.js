/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    LOCAL_APP_URL: 'http://localhost:3008/api',
  },
};

module.exports = nextConfig;
