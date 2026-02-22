import { Client, LogLevel } from '@notionhq/client';
import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { sortBy } from 'lodash';

import { siteConfig } from 'site-config';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
import { REVALIDATE } from 'src/lib/notion';
import {
  BlogArticle,
  BlogArticleRelation,
  BlogArticleRelationRecord,
  BlogProperties,
  CachedBlogArticleRelationRecord,
  CachedBlogProperties,
  CachedNotionDatabase,
  CachedNotionPage,
  ChildrensRecord,
  DatabasesRecord,
  DatabasesRetrieveProperties,
  GetNotionBlock,
  NotionBlocksChildren,
  NotionDatabase,
  NotionDatabasesQuery,
  NotionDatabasesRetrieve,
  NotionPage,
  NotionPageBlocks,
  NotionPagesRetrieve,
  NotionSearch,
  NotionUser
} from 'src/types/notion';

import * as notionCache from './cache';

type BlocksParams = {
  blockId: string;
  pageSize?: number;
  startCursor?: string;
};

type SearchParams = {
  searchValue: string;
  filter?: 'page' | 'database';
  direction?: 'ascending' | 'descending';
};

export class NotionClient {
  protected notion;

  constructor() {
    const auth = process.env['NOTION_API_SECRET_KEY'];
    if (!auth) {
      throw new Error('NOTION_API_SECRET_KEY environment variable is required.');
    }
    const logLevel = process.env['DEBUG_LOGS'] ? LogLevel.DEBUG : undefined;
    this.notion = new Client({
      auth,
      ...(logLevel !== undefined && { logLevel })
    });
  }

  private async getBlocksByBlockId({
    blockId,
    pageSize,
    startCursor
  }: BlocksParams): Promise<NotionBlocksChildren> {
    const blocks = (await this.notion.blocks.children.list({
      block_id: blockId,
      ...(pageSize !== undefined && { page_size: pageSize }),
      ...(startCursor !== undefined && { start_cursor: startCursor })
    })) as unknown as NotionBlocksChildren;

    return blocks;
  }

  // every Children return
  private async getAllChildrensRecordByBlockId(params: BlocksParams) {
    let childrenRecord: ChildrensRecord = {};

    let hasMore = false;
    let startCursor: string | null = null;
    do {
      const childrens = await this.notion.blocks.children.list({
        block_id: params.blockId,
        ...(params.pageSize !== undefined && { page_size: params.pageSize }),
        ...(params.startCursor !== undefined && { start_cursor: params.startCursor })
      });

      hasMore = childrens.has_more;
      startCursor = childrens.next_cursor;

      childrenRecord[params.blockId] = {
        ...childrens,
        results: [...(childrenRecord[params.blockId]?.results ?? []), ...childrens.results]
      } as unknown as ChildrensRecord[string];
    } while (hasMore && startCursor);

    const results = childrenRecord[params.blockId]?.results ?? [];
    for (const block of results) {
      const { has_children } = block;
      if (has_children) {
        await this.getAllChildrensRecordByBlockId({
          blockId: block.id
        }).then((children) => {
          childrenRecord = { ...childrenRecord, ...children };
        });
      }
    }

    return childrenRecord;
  }

  private pushChildDatabaseFetch(
    arr: Array<Promise<unknown>>,
    databasesRecord: DatabasesRecord,
    blockId: string
  ): void {
    arr.push(
      this.getPagesInDatabaseByDatabaseId({ id: blockId })
        .then((database) => {
          databasesRecord[blockId] = database;
        })
        .catch(() => {
          /* ignore: linked database may be unavailable */
        })
    );
  }

  private async fetchAllBlockPages(
    blockId: string,
    blocks: NotionBlocksChildren
  ): Promise<void> {
    let hasMore = blocks.has_more;
    let startCursor = blocks.next_cursor;
    while (hasMore && startCursor) {
      const moreBlocks = await this.getBlocksByBlockId({
        blockId,
        ...(startCursor != null && { startCursor })
      });
      blocks.results.push(...moreBlocks.results);
      hasMore = moreBlocks.has_more;
      startCursor = moreBlocks.next_cursor;
    }
  }

  async getAllBlocksAndChildrens(blockId: string): Promise<NotionPageBlocks> {
    const databasesRecord: DatabasesRecord = {};
    let childrensRecord: ChildrensRecord = {};
    const moreFetch: Array<Promise<unknown>> = [];

    const blocks = await this.getBlocksByBlockId({ blockId });
    await this.fetchAllBlockPages(blockId, blocks);

    // has_children import blocks
    for (const block of blocks.results) {
      if (block.has_children) {
        moreFetch.push(
          this.getAllChildrensRecordByBlockId({ blockId: block.id }).then((result) => {
            childrensRecord = { ...childrensRecord, ...result };
          })
        );
      }
      if (block.type === 'child_database') {
        this.pushChildDatabaseFetch(moreFetch, databasesRecord, block.id);
      }
    }

    await Promise.all(moreFetch);

    const childDatabaseFetching: Array<Promise<unknown>> = [];
    for (const children of Object.values(childrensRecord)) {
      if (!Array.isArray(children?.results)) continue;
      for (const block of children.results) {
        if (block.type === 'child_database') {
          this.pushChildDatabaseFetch(childDatabaseFetching, databasesRecord, block.id);
        }
      }
    }
    await Promise.all(childDatabaseFetching);

    const page = {
      ...blocks,
      childrensRecord,
      databasesRecord
    };

    return page;
  }

  async getPagesInDatabaseByDatabaseId(querys: {
    id: string;
    pageSize?: number;
    startCursor?: string;
  }): Promise<NotionDatabasesQuery> {
    const database = (await this.notion.databases.query({
      database_id: querys.id,
      ...(querys.startCursor !== undefined && { start_cursor: querys.startCursor }),
      ...(querys.pageSize !== undefined && { page_size: querys.pageSize })
    })) as unknown as NotionDatabasesQuery;

    return database;
  }

  async getAllPageInDatabase(querys: {
    databaseId: string;
    filter?: QueryDatabaseParameters['filter'];
    sorts?: QueryDatabaseParameters['sorts'];
  }): Promise<NotionDatabasesQuery> {
    let database = {} as NotionDatabasesQuery;
    const blocks: NotionDatabasesQuery['results'] = [];

    do {
      const getDatabase = (await this.notion.databases.query({
        database_id: querys.databaseId,
        ...(querys.sorts !== undefined && { sorts: querys.sorts }),
        ...(querys.filter !== undefined && { filter: querys.filter }),
        ...(database?.next_cursor != null && { start_cursor: database.next_cursor })
      })) as unknown as NotionDatabasesQuery;

      if (!getDatabase) {
        break;
      }
      database = getDatabase;
      if (getDatabase.results?.length) {
        blocks.push(...getDatabase.results);
      }
    } while (database.has_more && database.next_cursor);

    return { ...database, results: blocks };
  }

  async getDatabaseInfo(querys: { databaseId: string }): Promise<NotionDatabasesRetrieve> {
    const blockInfo = (await this.notion.databases
      .retrieve({
        database_id: querys.databaseId
      })
      .catch(() => null)) as NotionDatabasesRetrieve;

    return blockInfo;
  }

  async getBlockInfoByBlockId(blockId: string) {
    const blockInfo = await this.notion.blocks
      .retrieve({
        block_id: blockId
      })
      .catch(() => null);

    return blockInfo;
  }

  async getSearchPagesByDatabase({ searchValue, direction }: SearchParams) {
    const results: NotionSearch['results'] = [];
    let start_cursor: undefined | string;

    do {
      const search = (await this.notion.databases.query({
        database_id: siteConfig.notion.baseBlock,
        filter: {
          property: 'title',
          title: {
            contains: searchValue
          }
        },
        ...(direction !== undefined && {
          sorts: [{ direction, timestamp: 'created_time' as const }]
        }),
        ...(start_cursor !== undefined && { start_cursor })
      })) as unknown as NotionDatabasesQuery;

      if (Array.isArray(search?.results) && search.results.length > 0) {
        results.push(...search.results);
      }
      start_cursor = search.next_cursor || undefined;
    } while (start_cursor);

    const filteredResults = results.filter(
      (search) =>
        search?.properties?.publishedAt?.type !== 'date' ||
        (search?.properties?.publishedAt?.type === 'date' &&
          search?.properties?.publishedAt?.date?.start)
    );

    return filteredResults;
  }

  async getSearchPagesByWorkspace({ searchValue, filter, direction }: SearchParams) {
    const results: NotionSearch['results'] = [];
    let start_cursor: undefined | string;

    do {
      const search = (await this.notion.search({
        query: searchValue,
        ...(filter !== undefined && {
          filter: { property: 'object' as const, value: filter }
        }),
        ...(direction !== undefined && {
          sort: { direction, timestamp: 'last_edited_time' as const }
        }),
        ...(start_cursor !== undefined && { start_cursor })
      })) as NotionSearch;

      if (Array.isArray(search?.results) && search.results.length > 0) {
        results.push(...search.results);
      }
      start_cursor = search.next_cursor || undefined;
    } while (start_cursor);

    const filteredResults = results.filter(
      (search) =>
        search?.properties?.publishedAt?.type !== 'date' ||
        (search?.properties?.publishedAt?.type === 'date' &&
          search?.properties?.publishedAt?.date?.start)
    );

    return filteredResults;
  }

  async getPageInfo(querys: { pageId: string }) {
    const pageInfo = (await this.notion.pages
      .retrieve({
        page_id: querys.pageId
      })
      .catch(() => null)) as NotionPagesRetrieve;

    return pageInfo;
  }

  async getUserInfoByUserId(userId: string) {
    const profile = (await this.notion.users
      .retrieve({ user_id: userId })
      .catch(() => null)) as NotionUser | null;

    return profile;
  }

  async getPageByPageId(blockId: string): Promise<NotionPage> {
    const NO_CACHED = 'no cached';
    try {
      const exists = await this.accessCache(blockId);

      if (!exists) {
        throw NO_CACHED;
      }

      const cachePage = await this.getCache<CachedNotionPage>(blockId);

      if (!cachePage) {
        throw NO_CACHED;
      }

      const { cachedTime, ...pageBlocks } = cachePage;
      if (!pageBlocks?.pageInfo?.last_edited_time) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // If the cached time exceeds 55 minutes, restart
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE return if not
      if (timeDiff <= REVALIDATE * 1000) {
        return pageBlocks;
      }

      const newestPageInfo = await this.getPageInfo({ pageId: blockId });

      if (pageBlocks.pageInfo.last_edited_time === newestPageInfo.last_edited_time) {
        return pageBlocks;
      }
      throw NO_CACHED;
    } catch {
      /* Cache miss or stale: fetch fresh data */
      const [blocksAndChildrens, pageInfo] = await Promise.all([
        this.getAllBlocksAndChildrens(blockId),
        this.getPageInfo({ pageId: blockId })
      ]);
      const userInfo = await this.getUserInfoByUserId(pageInfo.created_by.id);

      const page: NotionPage = {
        block: blocksAndChildrens,
        pageInfo,
        userInfo
      };

      await this.setCache(blockId, {
        cachedTime: Date.now(),
        ...page
      });

      return page;
    }
  }

  async getAllPublishedPageInDatabase(querys: {
    databaseId: string;
    filter?: {
      category?: string;
      tag?: string;
    };
    databaseProperties?: DatabasesRetrieveProperties;
  }) {
    const filter = [] as Array<QueryDatabaseParameters['filter']>;
    if (querys.filter?.category) {
      filter.push({
        property: 'category',
        select: {
          equals: querys.filter.category
        }
      });
    }
    if (querys.filter?.tag) {
      filter.push({
        property: 'tags',
        multi_select: {
          contains: querys.filter.tag
        }
      });
    }

    const havePublishedAt = querys.databaseProperties?.publishedAt?.type === 'date';

    const { databaseId } = querys;
    const database = await this.getAllPageInDatabase({
      databaseId,
      filter: havePublishedAt
        ? {
            and: [
              {
                property: 'publishedAt',
                date: {
                  is_not_empty: true
                }
              },
              ...(filter as any)
            ]
          }
        : undefined,
      sorts: havePublishedAt
        ? [
            {
              property: 'publishedAt',
              direction: 'descending'
            }
          ]
        : undefined
    });

    return database;
  }

  async getDatabaseByDatabaseId(querys: {
    databaseId: string;
    filter?: {
      category?: string;
      tag?: string;
    };
  }): Promise<GetNotionBlock> {
    const { databaseId } = querys;
    const NO_CACHED = 'no cached';
    try {
      if (querys.filter) {
        throw NO_CACHED;
      }

      const exists = await this.accessCache(databaseId);
      if (!exists) {
        throw NO_CACHED;
      }

      const cachePage = await this.getCache<CachedNotionDatabase>(databaseId);
      if (!cachePage) {
        throw NO_CACHED;
      }

      const { cachedTime, ...page } = cachePage;
      if (!page?.pageInfo?.last_edited_time) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // If the cached time exceeds 55 minutes, restart
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE return if not
      if (timeDiff <= REVALIDATE * 1000) {
        return page;
      }

      const newestPageInfo = await this.getDatabaseInfo({
        databaseId
      });

      if (page.pageInfo.last_edited_time === newestPageInfo.last_edited_time) {
        return page;
      }
      throw NO_CACHED;
    } catch {
      const databaseInfo = await this.getDatabaseInfo({ databaseId });
      if (!databaseInfo?.created_by?.id) {
        throw new Error('Database info or creator not found.');
      }
      const database = await this.getAllPublishedPageInDatabase({
        databaseId,
        ...(querys.filter !== undefined && { filter: querys.filter }),
        ...(databaseInfo.properties !== undefined && {
          databaseProperties: databaseInfo.properties
        })
      });
      const userInfo = await this.getUserInfoByUserId(databaseInfo.created_by.id);

      const page = {
        block: {
          ...database,
          childrensRecord: {},
          databasesRecord: { [databaseId]: database }
        },
        pageInfo: databaseInfo,
        userInfo
      };

      if (!querys.filter) {
        await this.setCache(databaseId, {
          cachedTime: Date.now(),
          ...page
        });
      }

      return page;
    }
  }

  async getMainDatabase(): Promise<GetNotionBlock> {
    const databaseId = siteConfig.notion.baseBlock;

    const database = await this.getDatabaseByDatabaseId({
      databaseId
    });

    return database;
  }

  async searchSlug(querys: { slug: string; property: string }) {
    const search = (await this.notion.databases
      .query({
        database_id: siteConfig.notion.baseBlock,
        filter: {
          property: querys.property,
          rich_text: {
            equals: querys.slug
          }
        },
        sorts: [
          {
            property: 'publishedAt',
            direction: 'descending'
          }
        ]
      })
      .then((res) => res.results?.[0] || null)) as unknown as NotionDatabasesRetrieve;

    return search;
  }

  async getBlogProperties(): Promise<BlogProperties> {
    const databaseId = siteConfig.notion.baseBlock;
    const cacheKey = 'blog-properties';
    const NO_CACHED = 'no cached';
    try {
      const exists = await this.accessCache(cacheKey);
      if (!exists) {
        throw NO_CACHED;
      }

      const cacheData = await this.getCache<CachedBlogProperties>(cacheKey);
      if (!cacheData) {
        throw NO_CACHED;
      }

      const { cachedTime, lastEditedTime, categories, tags } = cacheData;
      if (!lastEditedTime || cacheData.databaseId !== databaseId) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // If the cached time exceeds 55 minutes, restart
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE return if not
      if (timeDiff <= REVALIDATE * 1000) {
        return { categories, tags };
      }

      const newestDatabaseInfo = await this.getDatabaseInfo({
        databaseId
      });

      if (lastEditedTime === newestDatabaseInfo.last_edited_time) {
        return { categories, tags };
      }
      throw NO_CACHED;
    } catch {
      /* Cache miss or stale: fetch fresh blog properties */
      const database = (await this.getDatabaseByDatabaseId({
        databaseId
      })) as NotionDatabase;
      const blocks = database.block;
      const databaseInfo = database.pageInfo;

      const tags: BlogProperties['tags'] = sortBy(
        databaseInfo?.properties?.tags?.multi_select?.options || [],
        'name'
      );

      const categories: BlogProperties['categories'] = [];
      if (databaseInfo?.properties.category?.type === 'select') {
        const categoriesRecord = blocks.results.reduce<
          Record<string, BlogProperties['categories'][number]>
        >((prev, current) => {
          const category = current?.properties?.category?.select;
          if (!category) {
            return prev;
          }

          const existing = prev[category.name];
          const newCategory = {
            ...category,
            count: existing ? (existing.count ?? 0) + 1 : 1
          };

          return {
            ...prev,
            [category.name]: newCategory
          };
        }, {});

        const keys = Object.keys(categoriesRecord).sort((a, b) => a.localeCompare(b));
        keys.forEach((key) => {
          const entry = categoriesRecord[key];
          if (entry) categories.push(entry);
        });
      }

      const blogProperties = {
        categories,
        tags
      };

      const cacheBlogProperties: CachedBlogProperties = {
        ...blogProperties,
        databaseId,
        lastEditedTime: database.pageInfo?.last_edited_time ?? '',
        cachedTime: Date.now()
      };

      await this.setCache(cacheKey, cacheBlogProperties);

      return blogProperties;
    }
  }

  async getBlogArticleRelation(querys: { pageId: string }): Promise<BlogArticleRelation> {
    const { pageId } = querys;
    const databaseId = siteConfig.notion.baseBlock;
    const cacheKey = 'blog-article-relations';
    const NO_CACHED = 'no cached';
    const defaultRelation: BlogArticleRelation = {
      id: '',
      prev: null,
      next: null
    };
    try {
      const exists = await this.accessCache(cacheKey);
      if (!exists) {
        throw NO_CACHED;
      }

      const cacheData = await this.getCache<CachedBlogArticleRelationRecord>(cacheKey);
      if (!cacheData) {
        throw NO_CACHED;
      }

      const { cachedTime, lastEditedTime, relationRecord } = cacheData;
      const blogArticleRelation = relationRecord[pageId];

      if (!lastEditedTime || !blogArticleRelation) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // If the cached time exceeds 55 minutes, restart
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE return if not
      if (timeDiff <= REVALIDATE * 1000) {
        return blogArticleRelation || defaultRelation;
      }

      const newestDatabaseInfo = await this.getDatabaseInfo({ databaseId });

      if (lastEditedTime === newestDatabaseInfo.last_edited_time) {
        return blogArticleRelation || defaultRelation;
      }

      throw NO_CACHED;
    } catch {
      const databaseInfo = await this.getDatabaseInfo({ databaseId });
      if (!databaseInfo) {
        throw new Error('Database not found');
      }
      const relationRecord = await this.getAllPublishedPageInDatabase({
        databaseId,
        ...(databaseInfo.properties !== undefined && {
          databaseProperties: databaseInfo.properties
        })
      }).then((res) => {
        const pages: BlogArticle[] = res.results.map((page) => {
          const publishedAt = page.properties.publishedAt?.date;
          return {
            title: richTextToPlainText(page.properties.title?.title),
            slug: richTextToPlainText(page.properties.slug?.rich_text),
            id: page.id.replaceAll('-', ''),
            ...(publishedAt != null && { publishedAt }),
            url: page.url
          };
        });

        const relationRecord: BlogArticleRelationRecord = {};

        pages.forEach((page, idx) => {
          const prev = pages[idx + 1] || null;
          const next = pages[idx - 1] || null;
          relationRecord[page.id] = {
            id: page.id,
            prev,
            next
          };
        });

        return relationRecord;
      });

      const cacheBlogProperties: CachedBlogArticleRelationRecord = {
        databaseId,
        lastEditedTime: databaseInfo.last_edited_time,
        cachedTime: Date.now(),
        relationRecord
      };

      await this.setCache(cacheKey, cacheBlogProperties);

      return relationRecord[pageId] || defaultRelation;
    }
  }

  async accessCache(blockId: string) {
    return notionCache.accessCache(blockId);
  }

  async getCache<T>(blockId: string) {
    return notionCache.get<T>(blockId);
  }

  async setCache(blockId: string, content: any) {
    return notionCache.set(blockId, content);
  }
}
