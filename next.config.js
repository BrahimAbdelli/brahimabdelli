try {
  if (!process.env.NOTION_API_SECRET_KEY) {
    throw 'NOTION_API_SECRET_KEY';
  }
  if (!process.env.NEXT_PUBLIC_NOTION_DATABASE_ID) {
    throw 'NEXT_PUBLIC_NOTION_DATABASE_ID';
  }
  if (!process.env.NEXT_PUBLIC_INFOMATION_BLOGNAME) {
    throw 'NEXT_PUBLIC_INFOMATION_BLOGNAME';
  }
} catch (err) {
  if (typeof err === 'string') {
    const message = `The environment variable \`${err}\` is required. Please check the \`/.env.sample\` and correct it.`;
    console.log('\x1b[37m\x1b[41m');
    console.log('ERROR - ' + message, '\x1b[0m');
    throw `\`${err}\` is invalide value`;
  }
}
/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const { i18n } = require('./next-i18next.config');

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withBundleAnalyzer(nextConfig);
