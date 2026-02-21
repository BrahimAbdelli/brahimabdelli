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

const useNotion = process.env.NEXT_PUBLIC_FEATURE_USE_NOTION === 'true';

if (useNotion) {
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
      throw new Error(`The environment variable \`${err}\` is required when Notion is enabled. Please check the \`/.env\` and correct it.`);
    }
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
  },
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

const configWithPWA = enableProgressiveWebApp
  ? withPWA({
      dest: 'public',
      disable: !isProduction,
      disableDevLogs: debugLogs,
      runtimeCaching: []
    })(nextConfig)
  : nextConfig;

const finalConfig = {
  ...configWithPWA,
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true
};

// Only use bundle analyzer when explicitly requested (avoids "no such file" errors in dev)
module.exports =
  process.env.ANALYZE === 'true' ? withBundleAnalyzer(finalConfig) : finalConfig;
