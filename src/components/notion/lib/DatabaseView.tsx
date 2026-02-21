import type React from 'react';
import { Fragment, useMemo, useState } from 'react';

import classNames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import { sortBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiNotion } from 'react-icons/si';

import { siteConfig } from 'site-config';
import { OptionalNextLink } from 'src/components/modules/OptionalNextLink';
import { notionTagColorClasses } from 'src/lib/notion';
import {
  categoryFilterItemClasses,
  categoryFilterItemActiveClasses,
  articleCardClasses,
  articleCardCoverClasses,
  articleCardLinkClasses
} from 'src/components/styles';
import type {
  FileObject,
  NotionDatabaseBlocks,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve,
  Property,
  RichText,
  Select
} from 'src/types/notion';

import { NotionSecureImage } from '.';
import { richTextToPlainText } from './utils';

type NotionDatabasePageViewProps = {
  databaseInfo: NotionDatabasesRetrieve;
  notionBlock: NotionDatabaseBlocks;
};

export const NotionDatabasePageView: React.FC<NotionDatabasePageViewProps> = ({
  databaseInfo,
  notionBlock
}): React.JSX.Element => {
  const router: ReturnType<typeof useRouter> = useRouter();
  const { t: _t }: ReturnType<typeof useTranslation> = useTranslation('common');
  const isBaseDatabase: boolean =
    siteConfig.notion.baseBlock === databaseInfo.id.replaceAll('-', '');
  const pages: NotionPagesRetrieve[] = notionBlock.results;

  const blocks: NotionPagesRetrieve[] = useMemo<NotionPagesRetrieve[]>((): NotionPagesRetrieve[] => {
    const filteredBlocks: NotionPagesRetrieve[] = pages.filter((block: NotionPagesRetrieve): boolean => {
      const { category, tag }: typeof router.query = router.query;

      if (!category && !tag) {
        return true;
      }

      let isFiltered: boolean = false;
      if (category) {
        isFiltered = block.properties.category?.select?.name === category;
      }
      if (tag) {
        const multiSelectNames: string[] =
          block.properties.tags?.multi_select?.map((select: Select): string => select.name) || [];
        if (Array.isArray(tag)) {
          for (const selectName of multiSelectNames) {
            isFiltered = tag.includes(selectName);
            if (isFiltered) {
              break;
            }
          }
        } else {
          isFiltered = multiSelectNames.includes(tag);
        }
      }

      return isFiltered;
    });

    return filteredBlocks;
  }, [pages, router.query]);

  const getCategoryFromQuery: () => string | null = (): string | null => {
    const category: string | string[] | undefined = router?.query?.['category'];
    if (!category) {
      return null;
    }
    if (Array.isArray(category)) {
      return category[0] || null;
    }
    return category || null;
  };

  const getTagFromQuery: () => string | null = (): string | null => {
    const tag: string | string[] | undefined = router?.query?.['tag'];
    if (!tag) {
      return null;
    }
    if (Array.isArray(tag)) {
      return tag[0] || null;
    }
    return tag || null;
  };

  const [categoryFilterKey, setCategoryFilterKey]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ] = useState<string | null>(getCategoryFromQuery());
  const [tagFilterKey, setTagFilterKey]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ] = useState<string | null>(getTagFromQuery());
  const [filterdBlocks, setFilterdBlocks]: [
    NotionPagesRetrieve[],
    React.Dispatch<React.SetStateAction<NotionPagesRetrieve[]>>
  ] = useState<NotionPagesRetrieve[]>([...blocks]);
  const haveTitleProperty: boolean = Boolean(databaseInfo.properties.title?.title);

  const handleClickCategoryItem: (key: string | null) => (event: React.MouseEvent<HTMLAnchorElement>) => void = (
    key: string | null
  ): ((event: React.MouseEvent<HTMLAnchorElement>) => void) => {
    return (event: React.MouseEvent<HTMLAnchorElement>): void => {
      if (!isBaseDatabase) {
        event.preventDefault();
      }
      if (databaseInfo.properties.category?.type !== 'select') {
        return;
      }
      setTagFilterKey(null);
      if (!key || key === categoryFilterKey) {
        setCategoryFilterKey(null);
        setFilterdBlocks([...pages]);
        return;
      }
      setCategoryFilterKey(key);
      const newFilteredBlocks: NotionPagesRetrieve[] = pages.filter(
        (block: NotionPagesRetrieve): boolean =>
          block.properties.category?.select?.name === key
      );
      setFilterdBlocks(newFilteredBlocks);
    };
  };

  const handleClickTagItem: (key: string | null) => (event: React.MouseEvent<HTMLAnchorElement>) => void = (
    key: string | null
  ): ((event: React.MouseEvent<HTMLAnchorElement>) => void) => {
    return (event: React.MouseEvent<HTMLAnchorElement>): void => {
      if (!isBaseDatabase) {
        event.preventDefault();
      }
      if (databaseInfo.properties.tags?.type !== 'multi_select') {
        return;
      }
      setCategoryFilterKey(null);
      if (!key || key === tagFilterKey) {
        setTagFilterKey(null);
        setFilterdBlocks([...pages]);
        return;
      }
      setTagFilterKey(key);
      const filterByTag: (block: NotionPagesRetrieve) => boolean = (block: NotionPagesRetrieve): boolean => {
        const tagNames: string[] = block.properties.tags?.multi_select?.map((select: Select): string => select.name) || [];
        return tagNames.includes(key);
      };
      const newFilteredBlocks: NotionPagesRetrieve[] = pages.filter(filterByTag);
      setFilterdBlocks(newFilteredBlocks);
    };
  };

  const categories: Record<string, number> = useMemo<Record<string, number>>(
    (): Record<string, number> => {
      if (databaseInfo.properties.category?.type !== 'select') {
        return {};
      }
      const categoryCounts: Record<string, number> = pages.reduce<Record<string, number>>(
        (accumulator: Record<string, number>, currentPage: NotionPagesRetrieve): Record<string, number> => {
          const categoryName: string | undefined = currentPage.properties.category?.select?.name;
          if (!categoryName) {
            return accumulator;
          }
          const categoryEntry: number | undefined = accumulator[categoryName];
          return {
            ...accumulator,
            [categoryName]: categoryEntry ? categoryEntry + 1 : 1
          };
        },
        {}
      );
      return categoryCounts;
    },
    [databaseInfo, pages]
  );

  const categoryKeys: string[] = Object.keys(categories).sort((a, b) => a.localeCompare(b));

  const tags: Select[] = useMemo(
    () => sortBy(databaseInfo?.properties?.tags?.multi_select?.options || [], 'name'),
    [databaseInfo]
  );

  return (
    <div className='flex flex-col sm:gap-4 sm:flex-row'>
      {categories && (
        <div className='grow-0 shrink-0 sm:sticky sm:left-0 sm:top-[calc(var(--header-height)_+_1em)] sm:z-0 sm:max-h-[calc(100vh_-_var(--header-height)_-_2em)]'>
          <aside className='flex h-full grow-0 shrink-0 p-3 gap-x-2 bg-base-100 text-sm sm:p-0 sm:mb-0 sm:flex-col sm:max-w-[200px] sm:gap-y-4 md:max-w-[220px] '>
            <div className='flex justify-center grow flex-col gap-y-3 sm:grow-0 sm:order-2 overflow-auto'>
              <ul className='flex-0 flex shrink-0 gap-x-2 overflow-x-auto scrollbar-hidden whitespace-nowrap sm:flex-col sm:px-2 sm:overflow-hidden sm:gap-y-1'>
                {categoryKeys.map((category) => (
                  <OptionalNextLink
                    wrappingAnchor={isBaseDatabase}
                    key={category}
                    href={category === categoryFilterKey ? '/' : `/category/${category}`}
                    scroll={false}
                    shallow={isBaseDatabase}
                    prefetch={false}
                    onClick={handleClickCategoryItem(category)}
                  >
                    <li
                      className={classNames(
                        categoryFilterItemClasses,
                        categoryFilterKey === category ? categoryFilterItemActiveClasses : null
                      )}
                    >
                      <span className='flex-auto grow-0 shrink overflow-hidden text-ellipsis'>
                        {category}
                      </span>
                      <span className='flex-auto grow-0 shrink-0'>({categories[category]})</span>
                    </li>
                  </OptionalNextLink>
                ))}
              </ul>
              <div className='hidden sm:flex grow-0 shrink-0 gap-1.5 flex-wrap px-2 order-3'>
                {tags.map((tag) => (
                  <OptionalNextLink
                    key={tag.id}
                    wrappingAnchor={isBaseDatabase}
                    className={classNames(
                      'cursor-pointer px-1.5 rounded-md hover:opacity-80',
                      notionTagColorClasses[tag.color],
                      `${
                        notionTagColorClasses[
                          `${tag.color}_background` as keyof typeof notionTagColorClasses
                        ]
                      }`,
                      tagFilterKey === tag.name ? 'opacity-100 font-bold' : 'opacity-70'
                    )}
                    href={tag.name === tagFilterKey ? '/' : `/tag/${tag.name}`}
                    scroll={false}
                    shallow={isBaseDatabase}
                    prefetch={false}
                    onClick={handleClickTagItem(tag.name)}
                  >
                    <span>{tag.name}</span>
                  </OptionalNextLink>
                ))}
              </div>
            </div>
            <div className='self-center flex-[0] shrink-0 input-group min-w-[180px] bg-base-100 rounded-md shadow-md dark:bg-base-content/5 sm:order-1' />
          </aside>
        </div>
      )}
      {haveTitleProperty && (
        <div className='flex-auto flex flex-col px-3 gap-y-4 sm:p-0 sm:gap-y-3'>
          {filterdBlocks.length ? (
            filterdBlocks.map((block: NotionPagesRetrieve): React.ReactElement => (
              <ArticleSummary key={block.id} article={block} />
            ))
          ) : (
            <div className='text-xl text-base-content/70 text-center'>Not Found Posts.</div>
          )}
        </div>
      )}
    </div>
  );
};

type ArticleSummaryProps = {
  article: NotionPagesRetrieve;
};

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article }): React.JSX.Element => {
  const { id, properties, icon, cover }: NotionPagesRetrieve = article;
  const {
    category: categoryProperty,
    tags,
    publishedAt
  }: NotionPagesRetrieve['properties'] = properties;
  const hasTagProperty: boolean = tags?.type === 'multi_select';

  const categoryName: string | null = categoryProperty?.select ? categoryProperty.select.name : null;
  const articleTitle: string = richTextToPlainText(properties?.title?.title);
  const articleSlug: string = richTextToPlainText(properties?.slug?.rich_text);
  const descriptionProperty: { description?: Property & { rich_text?: Array<RichText> } } = properties as unknown as { description?: Property & { rich_text?: Array<RichText> } };
  const articleDescription: string = richTextToPlainText(descriptionProperty?.description?.rich_text);

  const parentDatabaseId: string | undefined = article?.parent?.database_id?.replaceAll('-', '');

  const articleHref: string =
    parentDatabaseId === siteConfig.notion.baseBlock
      ? `/${encodeURIComponent(articleSlug)}`
      : `/${encodeURIComponent(id.replaceAll('-', ''))}/${encodeURIComponent(articleSlug || 'Untitled')}`;

  const renderCoverOrIcon: () => React.ReactElement = (): React.ReactElement => {
    if (cover) {
      return (
        <NotionSecureImage
          useNextImage
          blockId={id}
          blockType={article.object}
          useType={'cover'}
          initialFileObject={cover}
          alt={'page-cover'}
        />
      );
    }

    if (icon?.emoji) {
      return <div className='notion-database-item-empty-cover'>{icon.emoji}</div>;
    }

    if (icon?.file) {
      return (
        <NotionSecureImage
          useNextImage
          blockId={id}
          blockType={article.object}
          useType={'icon'}
          initialFileObject={icon as FileObject}
          alt={'page-icon'}
        />
      );
    }

    return (
      <div className='notion-database-item-empty-cover text-base-content/10'>
        <SiNotion />
      </div>
    );
  };

  return (
    <Link href={articleHref} prefetch={false} className={articleCardLinkClasses}>
      <div className={articleCardClasses}>
        <div className={articleCardCoverClasses}>{renderCoverOrIcon()}</div>
        <div className='flex-auto flex flex-col justify-between p-4 py-3 sm:py-2'>
          {categoryName && (
            <div className='text-xs text-zinc-500 line-clamp-1 text'>{categoryName}</div>
          )}
          <div className='line-clamp-2'>{articleTitle}</div>
          {articleDescription && (
            <div className='text-xs text-zinc-500 line-clamp-1 text'>{articleDescription}</div>
          )}
          <div className='mt-2 sm:mt-auto flex items-end justify-between gap-x-2 text-sm'>
            <div className='flex-1 line-clamp-1'>
              {hasTagProperty &&
                tags?.multi_select?.map((tag: Select, tagIndex: number): React.ReactElement => (
                  <Fragment key={tag.name}>
                    <span
                      className={classNames(
                        'px-1.5 rounded-md text-opacity-80',
                        notionTagColorClasses[tag.color],
                        notionTagColorClasses[
                          `${tag.color}_background` as keyof typeof notionTagColorClasses
                        ]
                      )}
                    >
                      {tag.name}
                    </span>
                    {tags.multi_select && tags.multi_select.length !== tagIndex && ' '}
                  </Fragment>
                ))}
            </div>
            <div>
              {publishedAt?.date?.start && (
                <div className='flex-auto grow-0 shrink-0 text-zinc-500'>
                  {formatInTimeZone(
                    new Date(publishedAt.date.start),
                    siteConfig.TZ,
                    'yyyy-MM-dd'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
