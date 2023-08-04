import type React from 'react';

import { useEffect } from 'react';

import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';

import { siteConfig } from 'site-config';
import Layout from 'src/components/Layout';
import { useCreateNotionStore, NotionZustandContext, NotionState } from 'src/store/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';

import 'src/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const notionProps: NotionState = {
    slug: pageProps?.slug,
    blogProperties: pageProps?.blogProperties,
    blogArticleRelation: pageProps?.blogArticleRelation,
    baseBlock: pageProps?.notionBlock?.block,
    pageInfo: pageProps?.notionBlock?.pageInfo,
    userInfo: pageProps?.notionBlock?.userInfo,
    childrensRecord: pageProps?.notionBlock?.block?.childrensRecord || {},
    databasesRecord: pageProps?.notionBlock?.block?.databasesRecord || {}
  };

  const SideWorks = () => {
    useEffect(() => {
      useSiteSettingStore.getState().setHydrated();
    }, []);

    return null;
  };

  const createStore = useCreateNotionStore({ ...notionProps });

  return (
    <NotionZustandContext.Provider createStore={createStore}>
      <NextSeo
        title={siteConfig.infomation.blogname}
        defaultTitle={siteConfig.infomation.blogname}
        openGraph={{
          site_name: siteConfig.infomation.blogname,
          title: siteConfig.infomation.blogname,
          locale: 'en_IE',
          type: 'website',
          description: siteConfig.infomation.blogname
            ? `${siteConfig.infomation.blogname} is a software engineer who loves to build solutions.`
            : 'A personal portfolio.'
        }}
        description={
          siteConfig.infomation.blogname
            ? `${siteConfig.infomation.blogname} is a software engineer who loves to build solutions.`
            : 'A personal portfolio.'
        }
      />
      <Head>
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
      <SideWorks />
    </NotionZustandContext.Provider>
  );
}

export default MyApp;
