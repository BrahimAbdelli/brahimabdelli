import type React from 'react';

import type { GetStaticPaths, GetStaticProps } from 'next';

import { featureFlags } from 'src/lib/featureFlags';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
import { NotionRender } from 'src/components/notion';
import type {
  BlogProperties,
  GetNotionBlock,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve,
} from 'src/types/notion';

interface SlugProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}

export default function Slug(): React.JSX.Element | null {
  if (!featureFlags.useNotion) return null;
  return <NotionRender />;
}

const getBlock = async (blockId: string, type: 'database' | 'page'): Promise<GetNotionBlock> => {
  const { NotionClient } = await import('lib/notion/Notion');
  const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

  switch (type) {
    case 'database': {
      const database: GetNotionBlock = await notionClient.getDatabaseByDatabaseId({
        databaseId: blockId
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
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({
  params
}): Promise<
  | { redirect: { permanent: false; destination: string } }
  | { props: SlugProps }
  | { notFound: true }
> => {
  if (!featureFlags.useNotion) {
    return { notFound: true };
  }

  const uuid: string | undefined = params?.['querys']?.[0]?.replaceAll('-', '');
  const slug: string | string[] | undefined = params?.['querys']?.[1];
  try {
    if (typeof uuid !== 'string') {
      throw new TypeError('type error "uuid"');
    }
    if (typeof slug !== 'string') {
      throw new TypeError('type error "slug"');
    }
    const { siteConfig } = await import('site-config');
    if (uuid === siteConfig.notion.baseBlock) {
      return {
        redirect: {
          permanent: false,
          destination: `/`
        }
      };
    }

    const { NotionClient } = await import('lib/notion/Notion');
    const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

    {
      const [_pageInfo, _databaseInfo]: [NotionPagesRetrieve | null, NotionDatabasesRetrieve] = await Promise.all([
        notionClient.getPageInfo({
          pageId: uuid
        }),
        notionClient.getDatabaseInfo({
          databaseId: uuid
        })
      ]);
      const pageInfo: NotionPagesRetrieve | NotionDatabasesRetrieve = _pageInfo || _databaseInfo || ({} as NotionPagesRetrieve);

      if (!pageInfo.object || (pageInfo.object !== 'page' && pageInfo.object !== 'database')) {
        throw new Error('page is not found');
      }

      const searchedPageSlug: string =
        pageInfo?.object === 'page'
          ? richTextToPlainText(pageInfo?.properties?.slug?.rich_text)
          : '';
      const parentIsBaseDatabase: boolean =
        pageInfo?.parent?.database_id?.replaceAll('-', '') === siteConfig.notion.baseBlock;
      if (parentIsBaseDatabase) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(searchedPageSlug)}`
          }
        };
      }

      const notionBlock: GetNotionBlock = await getBlock(pageInfo.id, pageInfo.object);

      if (!notionBlock) {
        throw new Error('page is not found');
      }

      const blogProperties: BlogProperties = await notionClient.getBlogProperties();

      return {
        props: {
          notionBlock,
          blogProperties,
          slug: uuid
        }
      };
    }
  } catch (e: unknown) {
    if (uuid && slug) {
      return {
        redirect: {
          permanent: false,
          destination: `/s/${encodeURIComponent(`${uuid} ${slug}`)}`
        }
      };
    }
    return {
      notFound: true
    };
  }
};
