import type React from 'react';

import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { featureFlags } from 'src/lib/featureFlags';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
import { NotionRender } from 'src/components/notion';

import type {
  BlogArticleRelation,
  BlogProperties,
  GetNotionBlock,
  NotionDatabasesQuery,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve,
} from 'src/types/notion';
import { URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';

interface SlugProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
  blogArticleRelation?: BlogArticleRelation;
}

export default function Slug(): React.JSX.Element | null {
  if (!featureFlags.useNotion) return null;
  return <NotionRender />;
}

function getSearchedPageSlug(
  pageInfo: NotionPagesRetrieve | NotionDatabasesRetrieve
): string {
  if (pageInfo.object === 'database') {
    return richTextToPlainText(
      pageInfo.title ??
        pageInfo.properties?.slug?.rich_text ??
        pageInfo.properties?.title?.title
    );
  }
  return richTextToPlainText(
    pageInfo.properties?.slug?.rich_text ?? pageInfo.properties?.title?.title
  );
}

const getBlock = async (
  blockId: string,
  type: 'database' | 'page'
): Promise<GetNotionBlock> => {
  const { NotionClient } = await import('lib/notion/Notion');
  const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

  switch (type) {
    case 'database': {
      const database: GetNotionBlock = await notionClient.getDatabaseByDatabaseId({
        databaseId: blockId,
      });

      return database;
    }
    case 'page': {
      const page: GetNotionBlock = await notionClient.getPageByPageId(blockId);
      return page;
    }
  }
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async (): Promise<{
  paths: Array<{ params: { slug: string } }>;
  fallback: 'blocking';
}> => {
  if (!featureFlags.useNotion) {
    return { paths: [], fallback: 'blocking' };
  }

  const { NotionClient } = await import('lib/notion/Notion');
  const { siteConfig } = await import('site-config');
  const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

  const paths: Array<{ params: { slug: string } }> = [];

  const database: NotionDatabasesQuery = await notionClient.getAllPublishedPageInDatabase({
    databaseId: siteConfig.notion.baseBlock,
  });
  for (const page of database.results) {
    const slug: string | undefined = page.properties.slug?.rich_text
      ?.map((text) => text.plain_text.trim())
      .join('')
      .slice(0, URL_PAGE_TITLE_MAX_LENGTH);

    if (slug) {
      paths.push({ params: { slug } });
    }
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

type StaticPropsResult =
  | { redirect: { permanent: false; destination: string } }
  | { props: SlugProps & Awaited<ReturnType<typeof serverSideTranslations>>; revalidate: number }
  | { notFound: true };

async function resolveBySlugProperty(
  notionClient: InstanceType<typeof import('lib/notion/Notion').NotionClient>,
  slug: string,
  locale: string | undefined,
  revalidate: number
): Promise<StaticPropsResult | null> {
  const pageInfo = await notionClient.searchSlug({ slug, property: 'slug' });
  if (!pageInfo) return null;
  const page = await getBlock(pageInfo.id, pageInfo.object);
  const blogProperties = await notionClient.getBlogProperties();
  let blogArticleRelation: BlogArticleRelation | undefined;
  if (page?.pageInfo?.object === 'page') {
    blogArticleRelation = await notionClient.getBlogArticleRelation({
      pageId: pageInfo.id.replaceAll('-', ''),
    });
  }
  return {
    props: {
      slug,
      notionBlock: page,
      blogProperties,
      ...(blogArticleRelation && { blogArticleRelation }),
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
    revalidate,
  };
}

async function resolveByTitleProperty(
  notionClient: InstanceType<typeof import('lib/notion/Notion').NotionClient>,
  slug: string,
  locale: string | undefined,
  baseBlock: string,
  revalidate: number
): Promise<StaticPropsResult | null> {
  const pageInfo = await notionClient.searchSlug({ slug, property: 'title' });
  if (!pageInfo) return null;
  if (pageInfo.parent.database_id?.replaceAll('-', '') === baseBlock) {
    const newSlug = richTextToPlainText(pageInfo.properties.slug?.rich_text);
    if (newSlug) {
      return { redirect: { permanent: false, destination: `/${encodeURIComponent(newSlug)}` } };
    }
  }
  const page = await getBlock(pageInfo.id, pageInfo.object);
  const blogProperties = await notionClient.getBlogProperties();
  let blogArticleRelation: BlogArticleRelation | undefined;
  if (page?.pageInfo?.object === 'page') {
    blogArticleRelation = await notionClient.getBlogArticleRelation({
      pageId: pageInfo.id.replaceAll('-', ''),
    });
  }
  return {
    props: {
      slug,
      notionBlock: page,
      blogProperties,
      ...(blogArticleRelation && { blogArticleRelation }),
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
    revalidate,
  };
}

async function resolveByUuid(
  notionClient: InstanceType<typeof import('lib/notion/Notion').NotionClient>,
  slug: string
): Promise<StaticPropsResult | null> {
  const [_pageInfo, _databaseInfo] = await Promise.all([
    notionClient.getPageInfo({ pageId: slug }),
    notionClient.getDatabaseInfo({ databaseId: slug }),
  ]);
  const pageInfo = _pageInfo ?? _databaseInfo;
  if (
    !pageInfo ||
    !('object' in pageInfo) ||
    (pageInfo.object !== 'page' && pageInfo.object !== 'database')
  ) {
    return null;
  }
  const searchedPageSlug = getSearchedPageSlug(pageInfo);
  if (!searchedPageSlug) return null;
  return {
    redirect: {
      permanent: false,
      destination: `/${encodeURIComponent(pageInfo.id.replaceAll('-', ''))}/${encodeURIComponent(searchedPageSlug)}`,
    },
  };
}

export const getStaticProps: GetStaticProps<SlugProps> = async ({
  params,
  locale
}): Promise<StaticPropsResult> => {
  if (!featureFlags.useNotion) return { notFound: true };

  const slug = params?.['slug'];
  try {
    if (typeof slug !== 'string') throw new TypeError('type error "slug"');
    const { siteConfig } = await import('site-config');
    if (slug === siteConfig.notion.baseBlock) {
      return { redirect: { permanent: false, destination: '/' } };
    }
    const { NotionClient } = await import('lib/notion/Notion');
    const { REVALIDATE } = await import('src/lib/notion');
    const notionClient = new NotionClient();

    const bySlug = await resolveBySlugProperty(notionClient, slug, locale, REVALIDATE);
    if (bySlug) return bySlug;
    const byTitle = await resolveByTitleProperty(
      notionClient,
      slug,
      locale,
      siteConfig.notion.baseBlock,
      REVALIDATE
    );
    if (byTitle) return byTitle;
    const byUuid = await resolveByUuid(notionClient, slug);
    if (byUuid) return byUuid;

    throw new Error('page is not found');
  } catch {
    /* Intentional: redirect to search or return 404 */
    if (typeof slug === 'string') {
      return { redirect: { permanent: false, destination: `/s/${encodeURIComponent(slug)}` } };
    }
    return { notFound: true };
  }
};
