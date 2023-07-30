/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false
});
const { i18n } = require('./next-i18next.config');

const isProduction = process.env.NODE_ENV === 'production';
const debugLogs = Boolean(process.env.DEBUG_LOGS);
const enableProgressiveWebApp = process.env.ENABLE_PROGRESSIVE_WEB_APP === 'true';

try {
  if (!process.env.NOTION_API_SECRET_KEY) {
    throw String('NOTION_API_SECRET_KEY');
  }
  if (!process.env.NEXT_PUBLIC_NOTION_DATABASE_ID) {
    throw String('NEXT_PUBLIC_NOTION_DATABASE_ID');
  }
  if (!process.env.NEXT_PUBLIC_INFOMATION_BLOGNAME) {
    throw String('NEXT_PUBLIC_INFOMATION_BLOGNAME');
  }
} catch (err) {
  if (typeof err === 'string') {
    const message = `The environment variable \`${err}\` is required. Please check the \`/.env\` and correct it.`;
    console.log('\x1b[37m\x1b[41m');
    console.log(`ERROR - ${message}`, '\x1b[0m');
    throw String(`\`${err}\` is invalide value`);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      's3.us-west-2.amazonaws.com',
      's3-us-west-2.amazonaws.com',
      'images.unsplash.com',
      'lh5.googleusercontent.com'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 1800
  }
  // experimental: {
  //   appDir: true
  // },
  // staticPageGenerationTimeout: 300, // In seconds, 5 minutes applied (default is 1 minute)
  // images: {
  //   domains: [
  //     'www.notion.so',
  //     'notion.so',
  //     's3.us-west-2.amazonaws.com',
  //     's3-us-west-2.amazonaws.com',
  //     'images.unsplash.com'
  //   ],
  //   formats: ['image/avif', 'image/webp'],
  //   dangerouslyAllowSVG: true,
  //   contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  //   minimumCacheTTL: 1800
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/aws-secure-notion-static/:path*',
  //       destination: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/:path*'
  //     },
  //     {
  //       source: '/aws-public-notion-static/:path*',
  //       destination: 'https://s3.us-west-2.amazonaws.com/public.notion-static.com/:path*'
  //     }
  //   ];
  // }
};

module.exports = enableProgressiveWebApp
  ? withPWA({
      dest: 'public',
      disable: !isProduction,
      disableDevLogs: debugLogs,
      runtimeCaching: []
    })(nextConfig)
  : nextConfig;

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true
});

module.exports = withBundleAnalyzer(nextConfig);
