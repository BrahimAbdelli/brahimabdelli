import type React from 'react';

import Head from 'next/head';

import { GetNotionBlock, URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';

export interface NotionSeoProps {
  page: GetNotionBlock['pageInfo'];
  title: string | null;
  description: string | null;
}

export const NotionSeo: React.FC<NotionSeoProps> = ({ page, title, description }) => {
  const url: string = page?.cover
    ? page?.cover?.type === 'external'
      ? page.cover.external?.url ?? ''
      : page?.cover?.type === 'file'
      ? ''
      : ''
    : '';
  const icon: string | false | undefined = page.icon?.file && page.icon?.type === 'file' && '?';

  return (
    <>
      <Head>
        <title>{title?.slice(0, URL_PAGE_TITLE_MAX_LENGTH) || 'Untitled'}</title>
        {description && (
          <meta name='description' content={description.slice(0, 155).trim()} />
        )}
        {url && <meta property='og:image' content={url} />}
        {icon ? (
          <>
            <link rel='apple-touch-icon' href={icon.includes('?') ? `${icon}&width=192` : icon} />
            <link
              rel='icon'
              type='image/png'
              sizes='16x16'
              href={icon.includes('?') ? `${icon}&width=16` : icon}
            />
            <link
              rel='icon'
              type='image/png'
              sizes='32x32'
              href={icon.includes('?') ? `${icon}&width=32` : icon}
            />
            <link
              rel='icon'
              type='image/png'
              sizes='192x192'
              href={icon.includes('?') ? `${icon}&width=192` : icon}
            />
            <link
              rel='shortcut icon'
              type='image/png'
              sizes='256x256'
              href={icon.includes('?') ? `${icon}&width=256` : icon}
            />
            <link
              rel='icon'
              type='image/png'
              sizes='512x512'
              href={icon.includes('?') ? `${icon}&width=512` : icon}
            />
          </>
        ) : page.icon?.emoji && page.icon?.type === 'emoji' ? (
          <>
            <link
              rel='apple-touch-icon'
              sizes='192x192'
              href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${page.icon.emoji}</text></svg>`}
            />
            <link
              rel='shortcut icon'
              href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${page.icon.emoji}</text></svg>`}
            />
            <link
              rel='icon'
              type='image/png'
              sizes='512x512'
              href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${page.icon.emoji}</text></svg>`}
            />
          </>
        ) : (
          <>
            <meta name='msapplication-TileImage' content='/icon-144x144.png' />
            <link rel='apple-touch-icon' sizes='192x192' href='/icon-192x192.png' />
            <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
            <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
            <link rel='icon' type='image/png' sizes='192x192' href='/icon-192x192.png' />
            <link rel='icon' type='image/png' sizes='512x512' href='/icon-512x512.png' />
          </>
        )}
      </Head>
    </>
  );
};
