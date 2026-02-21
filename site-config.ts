import { createSiteConfig } from './src/lib/siteConfig';

export const siteConfig = createSiteConfig({
  TZ: 'Europe/Paris',
  path: '/api/v1',
  notion: {
    baseBlock: (
      process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] ||
      process.env['NEXT_PUBLIC_NOTION_BASE_BLOCK'] ||
      ''
    )
      .replace(/-/g, '')
      .slice(0, 32),
    customDomain: process.env['NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN'] || null
  },
  infomation: {
    blogname: process.env['NEXT_PUBLIC_INFOMATION_BLOGNAME'] || '',
    ...(process.env['NEXT_PUBLIC_INFOMATION_EMAIL'] && {
      email: process.env['NEXT_PUBLIC_INFOMATION_EMAIL']
    }),
    ...(process.env['NEXT_PUBLIC_INFOMATION_GITHUB'] && {
      github: process.env['NEXT_PUBLIC_INFOMATION_GITHUB']
    }),
    ...(process.env['NEXT_PUBLIC_INFOMATION_REPOSITORY'] && {
      repository: process.env['NEXT_PUBLIC_INFOMATION_REPOSITORY']
    })
  },
  enableImageOptimization:
    process.env['NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION'] === 'true' ? true : false || false,
  hidePoweredBy: process.env['NEXT_PUBLIC_HIDE_POWERED_BY'] === 'true',
  ...(process.env['NEXT_PUBLIC_GOOGLE_G_TAG'] && {
    googleGTag: process.env['NEXT_PUBLIC_GOOGLE_G_TAG']
  })
});
