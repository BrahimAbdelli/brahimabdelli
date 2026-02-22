import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { featureFlags } from 'src/lib/featureFlags';
import { NotionRender } from 'src/components/notion';
import type {
  BlogProperties,
  GetNotionBlock,
  NotionDatabasesRetrieve,
  Select,
} from 'src/types/notion';

interface CategoryProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}
const Category: NextPage<CategoryProps> = () => {
  if (!featureFlags.useNotion) return null;
  return <NotionRender />;
};

export const getStaticPaths: GetStaticPaths<{ category: string }> = async (): Promise<{
  paths: Array<{ params: { category: string } }>;
  fallback: 'blocking';
}> => {
  if (!featureFlags.useNotion) {
    return { paths: [], fallback: 'blocking' };
  }

  const { NotionClient } = await import('lib/notion/Notion');
  const { siteConfig } = await import('site-config');
  const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

  const paths: Array<{ params: { category: string } }> = [];

  const database: NotionDatabasesRetrieve = await notionClient.getDatabaseInfo({
    databaseId: siteConfig.notion.baseBlock
  });

  const categories: Array<Select> = database?.properties?.category?.select?.options || [];
  for (const category of categories) {
    paths.push({
      params: {
        category: category.name
      }
    });
  }

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async ({
  params
}): Promise<
  | { props: CategoryProps; revalidate: number }
  | { notFound: true }
> => {
  if (!featureFlags.useNotion) {
    return { notFound: true };
  }

  const category: string | string[] | undefined = params?.['category'];
  try {
    if (typeof category !== 'string') {
      throw new TypeError('category must be a string');
    }
    const { NotionClient } = await import('lib/notion/Notion');
    const { siteConfig } = await import('site-config');
    const { REVALIDATE } = await import('src/lib/notion');
    const notionClient: InstanceType<typeof NotionClient> = new NotionClient();

    const database: GetNotionBlock = await notionClient.getDatabaseByDatabaseId({
      databaseId: siteConfig.notion.baseBlock
    });

    const blogProperties: BlogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        notionBlock: database,
        blogProperties
      },
      revalidate: REVALIDATE
    };
  } catch {
    return { notFound: true };
  }
};

export default Category;
