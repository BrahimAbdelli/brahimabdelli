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

export const getStaticProps: GetStaticProps<SlugProps> = async ({
  params,
  locale
}): Promise<
  | { redirect: { permanent: false; destination: string } }
  | { props: SlugProps & Awaited<ReturnType<typeof serverSideTranslations>>; revalidate: number }
  | { notFound: true }
> => {
  if (!featureFlags.useNotion) {
    return { notFound: true };
  }

  const slug: string | string[] | undefined = params?.['slug'];
  try {
    if (typeof slug !== 'string') {
      throw new TypeError('type error "slug"');
    }
    const { siteConfig } = await import('site-config');
    if (slug === siteConfig.notion.baseBlock) {
      return {
        redirect: {
          permanent: false,
          destination: `/`
        }
      };
    }
    const { NotionClient } = await import('lib/notion/Notion');
    const { REVALIDATE } = await import('src/lib/notion');
    const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

    {
      const pageInfo: NotionDatabasesRetrieve = await notionClient.searchSlug({
        slug,
        property: 'slug',
      });

      if (pageInfo) {
        const page: GetNotionBlock = await getBlock(pageInfo.id, pageInfo.object);
        const blogProperties: BlogProperties = await notionClient.getBlogProperties();
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
          revalidate: REVALIDATE,
        };
      }
    }

    {
      const pageInfo: NotionDatabasesRetrieve = await notionClient.searchSlug({
        slug,
        property: 'title',
      });

      if (pageInfo) {
        if (pageInfo.parent.database_id?.replaceAll('-', '') === siteConfig.notion.baseBlock) {
          const newSlug: string = richTextToPlainText(pageInfo.properties.slug?.rich_text);
          if (newSlug) {
            return {
              redirect: {
                permanent: false,
                destination: `/${encodeURIComponent(newSlug)}`,
              },
            };
          }
        }
        const page: GetNotionBlock = await getBlock(pageInfo.id, pageInfo.object);
        const blogProperties: BlogProperties = await notionClient.getBlogProperties();
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
          revalidate: REVALIDATE,
        };
      }
    }

    {
      const [_pageInfo, _databaseInfo]: [NotionPagesRetrieve | null, NotionDatabasesRetrieve] = await Promise.all([
        notionClient.getPageInfo({
          pageId: slug,
        }),
        notionClient.getDatabaseInfo({
          databaseId: slug,
        }),
      ]);
      const pageInfo: NotionPagesRetrieve | NotionDatabasesRetrieve = _pageInfo ?? _databaseInfo;

      if (!pageInfo?.object || (pageInfo.object !== 'page' && pageInfo.object !== 'database')) {
        throw new Error('page is not found');
      }

      let searchedPageSlug: string = '';

      switch (pageInfo.object) {
        case 'database': {
          searchedPageSlug = richTextToPlainText(
            pageInfo?.title ||
              pageInfo?.properties?.slug?.rich_text ||
              pageInfo.properties.title?.title
          );
          break;
        }
        case 'page': {
          searchedPageSlug = richTextToPlainText(
            pageInfo?.properties?.slug?.rich_text || pageInfo.properties.title?.title
          );
          break;
        }
      }

      if (searchedPageSlug) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(
              pageInfo.id.replaceAll('-', '')
            )}/${encodeURIComponent(searchedPageSlug)}`,
          },
        };
      }
    }

    throw new Error('page is not found');
  } catch (e: unknown) {
    if (typeof slug === 'string') {
      return {
        redirect: {
          permanent: false,
          destination: `/s/${encodeURIComponent(slug)}`,
        },
      };
    }
    return {
      notFound: true,
    };
  }
};
