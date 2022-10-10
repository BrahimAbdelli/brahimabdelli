const { nextI18NextRewrites } = require('next-i18next/rewrites');

const localeSubpaths = { fr: 'fr', en: 'en' };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
};

module.exports = nextConfig;
