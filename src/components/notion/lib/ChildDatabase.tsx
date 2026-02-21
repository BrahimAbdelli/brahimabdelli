'use client';

import type React from 'react';
import { useMemo, useState } from 'react';

import { sortBy } from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';

import { useNotionStore, type NotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve, NotionDatabasesQuery, NotionPagesRetrieve } from 'src/types/notion';
import { URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';

import { ChildDatabaseItem } from './ChildDatabaseItem';
import { CopyHeadingLink, HeadingContainer, HeadingInner } from './Heading';
import { richTextToPlainText } from './utils';

export interface ChildDatabaseProps {
  block: NotionBlocksRetrieve;
}

type SortKeys = 'title' | 'created_time' | 'last_edited_time';

const defaultSortRecord: {
  readonly title: 'title';
  readonly created_time: 'created time';
  readonly last_edited_time: 'edited time';
} = {
  title: 'title',
  created_time: 'created time',
  last_edited_time: 'edited time'
} as const;
const orderKeys: Array<keyof typeof defaultSortRecord> = Object.keys(defaultSortRecord) as Array<keyof typeof defaultSortRecord>;

export const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block }) => {
  const { databasesRecord }: NotionStore = useNotionStore();
  const database: NotionDatabasesQuery | undefined = databasesRecord?.[block.id];

  const pathname: string | null = usePathname();

  const [blocks, setBlocks] = useState<Array<NotionPagesRetrieve & { title?: string }>>(
    sortBy(
      database?.results?.[0]?.properties?.title?.type === 'title'
        ? database?.results.map((databaseBlock: NotionPagesRetrieve) => {
            const title: string =
              richTextToPlainText(databaseBlock?.properties?.title?.title) || 'Untitled';
            const newBlock: NotionPagesRetrieve & { title: string } = {
              ...databaseBlock,
              title
            };
            return newBlock;
          }) || []
        : database?.results || [],
      'created_time'
    ).reverse()
  );
  const [sortKey, setSortKey] = useState<SortKeys>('created_time');
  const [isOrderAsc, setIsOrderAsc] = useState<boolean>(true);

  const sortByTimeKey: (key: 'last_edited_time' | 'created_time') => void = (key: 'last_edited_time' | 'created_time'): void => {
    if (key === sortKey) {
      const newIsOrderAsc: boolean = !isOrderAsc;
      setBlocks((prevBlocks) =>
        newIsOrderAsc ? sortBy(prevBlocks, key).reverse() : sortBy(prevBlocks, key)
      );
      setSortKey(key);
      setIsOrderAsc(newIsOrderAsc);
    } else {
      setBlocks((prevBlocks) => sortBy(prevBlocks, key).reverse());
      setSortKey(key);
      setIsOrderAsc(true);
    }
  };

  const sortByTitleKey: () => void = (): void => {
    if (sortKey === 'title') {
      const newIsOrderAsc: boolean = !isOrderAsc;
      setBlocks((prevBlocks) =>
        newIsOrderAsc ? sortBy(prevBlocks, 'title') : sortBy(prevBlocks, 'title').reverse()
      );
      setSortKey('title');
      setIsOrderAsc(newIsOrderAsc);
    } else {
      setBlocks((prevBlocks) => sortBy(prevBlocks, 'title'));
      setSortKey('title');
      setIsOrderAsc(true);
    }
  };

  const handleCloseSortMenu: (newSortKey: SortKeys) => () => void = (newSortKey: SortKeys) => (): void => {
    switch (newSortKey) {
      case 'last_edited_time':
      case 'created_time':
        sortByTimeKey(newSortKey);
        break;
      case 'title':
        sortByTitleKey();
        break;
    }
  };
  const type: 'child_database' = block.type as 'child_database';
  const hash: string = `${block?.child_database?.title.trim().slice(0, URL_PAGE_TITLE_MAX_LENGTH) || ''}`;
  const href: string = useMemo(() => `${pathname?.replace(/#.*/, '')}#${hash}`, [hash, pathname]);

  return (
    <div>
      <HeadingContainer id={hash} type={type}>
        <HeadingInner type={type}>
          <div className='flex-auto mb-1'>
            <div className='flex items-center justify-between'>
              <p className=''>
                {block?.child_database?.title || 'Untitled'}
                <CopyHeadingLink href={href}>
                  <Link href={`#${encodeURIComponent(hash)}`}>&nbsp;🔗</Link>
                </CopyHeadingLink>
              </p>
              <div className='dropdown dropdown-left'>
                <label
                  tabIndex={0}
                  className='text-xl btn btn-ghost btn-sm text-inherit flex-nowrap whitespace-nowrap capitalize'
                >
                  {defaultSortRecord[sortKey]}
                  {isOrderAsc ? <BsArrowUpShort /> : <BsArrowDownShort />}
                </label>
                <ul
                  tabIndex={0}
                  className='p-2 text-lg shadow dropdown-content menu bg-base-100 rounded-box w-52'
                >
                  {orderKeys.map((key) => {
                    return (
                      <li key={key} onClick={handleCloseSortMenu(key)}>
                        <div className='gap-x-0.5 px-3 py-2 capitalize'>
                          {defaultSortRecord[key]}
                          {sortKey === key ? (
                            isOrderAsc ? (
                              <BsArrowUpShort />
                            ) : (
                              <BsArrowDownShort />
                            )
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </HeadingInner>
      </HeadingContainer>
      <div className='grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2 lg:grid-cols-3'>
        {blocks.map((block) => (
          <ChildDatabaseItem key={`database-${block.id}`} block={block} sortKey={sortKey} />
        ))}
      </div>
    </div>
  );
};
