import type React from 'react';

import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import ArticleDetail from 'src/components/articles/ArticleDetail';
import type { Article } from 'src/lib/articles';
import { featureFlags } from 'src/lib/featureFlags';

interface ArticlePageProps {
  article: Article;
}

const ArticlePage: NextPage<ArticlePageProps> = ({ article }: ArticlePageProps) => {
  return (
    <>
      <Head>
        <title>{`${article.frontmatter.title} – Brahim Abdelli`}</title>
        <meta name="description" content={article.frontmatter.description} />
      </Head>
      <ArticleDetail article={article} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async (): Promise<{
  paths: Array<{ params: { slug: string[] } }>;
  fallback: boolean | 'blocking';
}> => {
  if (featureFlags.useNotion) {
    return { paths: [], fallback: 'blocking' };
  }

  const { getAllArticles } = await import('src/lib/articles');
  const articles: Article[] = getAllArticles();

  const paths: Array<{ params: { slug: string[] } }> = articles.map((article: Article) => ({
    params: { slug: article.slug.split('/') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({
  params,
  locale,
}): Promise<
  | { props: ArticlePageProps & Awaited<ReturnType<typeof serverSideTranslations>> }
  | { notFound: true }
> => {
  if (featureFlags.useNotion) {
    return { notFound: true };
  }

  const slugParts: string | string[] | undefined = params?.['slug'];
  if (!Array.isArray(slugParts)) {
    return { notFound: true };
  }

  const slug: string = slugParts.join('/');
  const { getArticleBySlug } = await import('src/lib/articles');
  const article: Article | null = getArticleBySlug(slug);

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      article: structuredClone(article),
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default ArticlePage;
