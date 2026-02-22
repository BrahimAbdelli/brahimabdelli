import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { featureFlags } from 'src/lib/featureFlags';
import { NotionRender } from 'src/components/notion';
import ArticleList from 'src/components/articles/ArticleList';

import type { Article } from 'src/lib/articles';
import type { BlogProperties, GetNotionBlock } from 'src/types/notion';

interface LocalArticlesProps {
  readonly mode: 'local';
  readonly articles: Article[];
}

interface NotionArticlesProps {
  readonly mode: 'notion';
  readonly slug: string;
  readonly notionBlock: GetNotionBlock;
  readonly blogProperties: BlogProperties;
}

type ArticlesPageProps = LocalArticlesProps | NotionArticlesProps;

const ArticlesPage: NextPage<ArticlesPageProps> = (props: ArticlesPageProps) => {
  const { t }: ReturnType<typeof useTranslation> = useTranslation('common');

  if (props.mode === 'notion') {
    return <NotionRender />;
  }

  return (
    <>
      <Head>
        <title>{`${t('articles.title', { defaultValue: 'Articles' })} – Brahim Abdelli`}</title>
      </Head>
      <div className='w-full max-w-5xl mx-auto px-4 py-10'>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8'>
          {t('articles.title', { defaultValue: 'Articles' })}
        </h1>
        <ArticleList articles={props.articles} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<ArticlesPageProps> = async ({
  locale,
}) => {
  if (featureFlags.useNotion) {
    const { NotionClient } = await import('lib/notion/Notion');
    const { siteConfig } = await import('site-config');
    const { REVALIDATE } = await import('src/lib/notion');

    try {
      const notionClient = new NotionClient();
      const database = await notionClient.getMainDatabase();
      const blogProperties = await notionClient.getBlogProperties();

      return {
        props: {
          mode: 'notion' as const,
          slug: siteConfig.notion.baseBlock,
          notionBlock: database,
          blogProperties,
          ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
        revalidate: REVALIDATE,
      };
    } catch {
      return { notFound: true };
    }
  }

  const { getAllArticles } = await import('src/lib/articles');
  const articles: Article[] = getAllArticles();

  return {
    props: {
      mode: 'local' as const,
      articles: structuredClone(articles),
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default ArticlesPage;
