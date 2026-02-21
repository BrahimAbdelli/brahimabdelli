import type React from 'react';

import { useEffect } from 'react';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';

import { siteConfig } from 'site-config';
import Layout from 'src/components/Layout';
import { useCreateNotionStore, NotionZustandContext, NotionState } from 'src/store/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';

import 'src/styles/globals.css';

const DEFAULT_DESCRIPTION = 'A personal portfolio.';

const getSiteDescription = (blogName: string): string => {
  return blogName
    ? `${blogName} is a software engineer who loves to build solutions.`
    : DEFAULT_DESCRIPTION;
};

const createNotionProps = (pageProps: AppProps['pageProps']): NotionState => ({
  slug: pageProps?.slug,
  blogProperties: pageProps?.blogProperties,
  blogArticleRelation: pageProps?.blogArticleRelation,
  baseBlock: pageProps?.notionBlock?.block,
  pageInfo: pageProps?.notionBlock?.pageInfo,
  userInfo: pageProps?.notionBlock?.userInfo,
  childrensRecord: pageProps?.notionBlock?.block?.childrensRecord || {},
  databasesRecord: pageProps?.notionBlock?.block?.databasesRecord || {},
});

const HydrationInitializer = (): null => {
  useEffect((): void => {
    useSiteSettingStore.getState().setHydrated();
  }, []);

  return null;
};

function MyApp({ Component, pageProps }: AppProps): React.JSX.Element {
  const notionProps: NotionState = createNotionProps(pageProps);
  const createStore = useCreateNotionStore(notionProps);
  const blogName: string = siteConfig.infomation.blogname;
  const siteDescription: string = getSiteDescription(blogName);

  return (
    <NotionZustandContext.Provider value={createStore()}>
      <Head>
        <title>{blogName}</title>
        <meta name='description' content={siteDescription} />
        <meta property='og:site_name' content={blogName} />
        <meta property='og:title' content={blogName} />
        <meta property='og:locale' content='en_IE' />
        <meta property='og:type' content='website' />
        <meta property='og:description' content={siteDescription} />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      {siteConfig.googleGTag && (
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleGTag}`} />
      )}
      {siteConfig.googleGTag && (
        <Script id='google-analytics' strategy='afterInteractive'>
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', '${siteConfig.googleGTag}');`}
        </Script>
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <HydrationInitializer />
    </NotionZustandContext.Provider>
  );
}

export default appWithTranslation(MyApp);
