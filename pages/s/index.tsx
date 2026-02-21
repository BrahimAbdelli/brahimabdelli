import type { GetStaticProps, GetStaticPropsResult, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { featureFlags } from 'src/lib/featureFlags';
import type { BlogProperties } from 'src/types/notion';

type SearchIndexProps = {
  blogProperties?: BlogProperties;
};

const SearchIndex: NextPage<SearchIndexProps> = ({ blogProperties: _blogProperties }) => {
  const { t }: ReturnType<typeof useTranslation> = useTranslation('common');

  if (!featureFlags.useNotion) {
    return (
      <div className='w-full max-w-[var(--article-max-width)] m-auto my-6 px-3 text-center py-16'>
        <p className='text-lg text-slate-500'>Search is disabled when Notion is off.</p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[var(--article-max-width)] m-auto my-6 px-3'>
      <div className='max-w-screen-sm mt-4 mx-auto text-center'>
        <h1 className='text-2xl'>{t('articles.searchs.entersearch')}</h1>
        <div className='mt-10'>{}</div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<SearchIndexProps> = async ({
  locale,
}): Promise<GetStaticPropsResult<SearchIndexProps>> => {
  if (!featureFlags.useNotion) {
    return {
      props: {
        ...(await serverSideTranslations(locale as string, ['common'])),
      } as unknown as SearchIndexProps & Awaited<ReturnType<typeof serverSideTranslations>>,
    };
  }

  try {
    const { NotionClient } = await import('lib/notion/Notion');
    const { REVALIDATE } = await import('src/lib/notion');
    const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

    const blogProperties: BlogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        blogProperties,
        ...(await serverSideTranslations(locale as string, ['common'])),
      },
      revalidate: REVALIDATE,
    };
  } catch {
    return { notFound: true };
  }
};

export default SearchIndex;
