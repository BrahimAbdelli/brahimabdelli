import { SiteConfig } from 'src/types/types';

export function createSiteConfig(config: SiteConfig): SiteConfig {
  const { NEXT_PUBLIC_HEADER_MENU }: NodeJS.ProcessEnv = process.env;
  const headerNav: SiteConfig['headerNav'] = [];

  if (NEXT_PUBLIC_HEADER_MENU) {
    const stringList: string[] = NEXT_PUBLIC_HEADER_MENU.split(',');
    const stringListLen: number = stringList.length;
    if (stringListLen > 1 && stringListLen % 2 === 0) {
      for (let i: number = 0; i <= stringListLen / 2; i += 2) {
        const name: string = stringList[i] ?? '';
        const slug: string = stringList[i + 1] ?? '';
        if (name && slug) {
          headerNav.push({
            name,
            slug: slug.trim(),
          });
        }
      }
    }
  }

  if (config.notion.customDomain) {
    config.notion.notionSoRegExp = new RegExp(
      `^https?://${config.notion.customDomain}.notion.site/`,
      'i'
    );
    config.notion.notionSiteRegExp = new RegExp(
      `^https?://(www.)?notion.so/${config.notion.customDomain}/`,
      'i'
    );
  }

  return { ...config, headerNav };
}
