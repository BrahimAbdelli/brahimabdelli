import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { featureFlags } from 'src/lib/featureFlags';
import { NotionRender } from 'src/components/notion';
import type {
  BlogProperties,
  GetNotionBlock,
  MultiSelect,
  NotionDatabasesRetrieve,
} from 'src/types/notion';

interface TagProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}
const Tag: NextPage<TagProps> = () => {
  if (!featureFlags.useNotion) return null;
  return <NotionRender />;
};

export const getStaticPaths: GetStaticPaths<{ tag: string }> = async (): Promise<{
  paths: Array<{ params: { tag: string } }>;
  fallback: 'blocking';
}> => {
  if (!featureFlags.useNotion) {
    return { paths: [], fallback: 'blocking' };
  }

  const { NotionClient } = await import('lib/notion/Notion');
  const { siteConfig } = await import('site-config');
  const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

  const paths: Array<{ params: { tag: string } }> = [];

  const database: NotionDatabasesRetrieve = await notionClient.getDatabaseInfo({
    databaseId: siteConfig.notion.baseBlock,
  });

  const tags: MultiSelect = database?.properties?.tags?.multi_select?.options ?? [];
  for (const tag of tags) {
    paths.push({
      params: {
        tag: tag.name,
      },
    });
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<TagProps> = async ({
  params,
  locale,
}): Promise<
  | { props: TagProps & Awaited<ReturnType<typeof serverSideTranslations>>; revalidate: number }
  | { notFound: true }
> => {
  if (!featureFlags.useNotion) {
    return { notFound: true };
  }

  const tag: string | string[] | undefined = params?.['tag'];
  try {
    if (typeof tag !== 'string') {
      throw new TypeError('tag must be a string');
    }
    const { NotionClient } = await import('lib/notion/Notion');
    const { siteConfig } = await import('site-config');
    const { REVALIDATE } = await import('src/lib/notion');
    const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

    const database: GetNotionBlock = await notionClient.getDatabaseByDatabaseId({
      databaseId: siteConfig.notion.baseBlock,
    });
    const blogProperties: BlogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        notionBlock: database,
        blogProperties,
        ...(await serverSideTranslations(locale as string, ['common'])),
      },
      revalidate: REVALIDATE,
    };
  } catch {
    return { notFound: true };
  }
};

export default Tag;
