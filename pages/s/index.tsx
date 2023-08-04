import React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { SearchForm } from 'src/components/search/SearchForm';
import { BlogProperties } from 'src/types/notion';
import { NotionClient } from 'lib/notion/Notion';
import { REVALIDATE } from 'src/lib/notion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

type SearchIndexProps = {
  blogProperties: BlogProperties;
};

const SearchIndex: NextPage<SearchIndexProps> = ({ blogProperties }) => {
  const { t } = useTranslation('common');
  return (
    <div className='w-full max-w-[var(--article-max-width)] m-auto my-6 px-3'>
      <div className='max-w-screen-sm mt-4 mx-auto text-center'>
        <h1 className='text-2xl'>{t('articles.searchs.entersearch')}</h1>
        <div className='mt-10'>{/* <SearchForm autoFocus /> */}</div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<SearchIndexProps> = async ({ locale }) => {
  try {
    const notionClient = new NotionClient();

    const blogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        blogProperties,
        ...(await serverSideTranslations(locale as string, ['common']))
      },
      revalidate: REVALIDATE
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default SearchIndex;
