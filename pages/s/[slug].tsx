import React from 'react';

import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { featureFlags } from 'src/lib/featureFlags';
import { ChildDatabaseItem } from 'src/components/notion/lib/ChildDatabaseItem';
import { SearchForm } from 'src/components/search/SearchForm';
import type { NotionPagesRetrieve, NotionSearch } from 'src/types/notion';

interface SearchResult {
  searchValue?: string;
  searchResult?: NotionSearch['results'];
}

function NotionSearchView({ searchValue, searchResult, pathname, t }: {
  readonly searchValue?: string;
  readonly searchResult?: NotionSearch['results'];
  readonly pathname: string;
  readonly t: (key: string) => string;
}): React.JSX.Element {
  return (
    <div className='w-full max-w-[var(--article-max-width)] m-auto my-6 px-3'>
      <div>
        <div className='max-w-screen-sm mt-4 mx-auto text-center'>
          <h1 className='text-2xl'>
            {pathname === '/' ? `${t('articles.searchs.entersearch')}` : 'Type your search'}
          </h1>
          <div className='mt-10'>
            <SearchForm
              key={searchValue ?? 'search-form'}
              {...(searchValue === undefined ? {} : { searchValue })}
              autoFocus
            />
          </div>
        </div>
        <div className='mt-10'>
          {Array.isArray(searchResult) && searchResult.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {searchResult.map((search) => (
                <ChildDatabaseItem
                  key={`search-${search.id}`}
                  block={search as NotionPagesRetrieve}
                  sortKey={'created_time'}
                />
              ))}
            </div>
          ) : (
            <div className='text-center'>
              {pathname === '/' ? `${t('articles.searchs.noresultsfound')}` : 'No results found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Search({ searchValue, searchResult }: Readonly<SearchResult>): React.JSX.Element {
  const { t }: ReturnType<typeof useTranslation> = useTranslation('common');
  const router: ReturnType<typeof useRouter> = useRouter();
  const pathname: string = router.pathname;

  if (featureFlags.useNotion) {
    return (
      <NotionSearchView
        searchValue={searchValue}
        searchResult={searchResult}
        pathname={pathname}
        t={t}
      />
    );
  }

  return (
    <div className="w-full max-w-[var(--article-max-width)] m-auto my-6 px-3 text-center py-16">
      <p className="text-lg text-slate-500">Search is disabled when Notion is off.</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SearchResult> = async ({
  query: _query,
  params,
  locale
}): Promise<GetServerSidePropsResult<SearchResult>> => {
  if (!featureFlags.useNotion) {
    return {
      props: {
        searchValue: '',
        ...(await serverSideTranslations(locale as string, ['common'])),
      },
    };
  }

  const slug: string | string[] | undefined = params?.['slug'];

  if (typeof slug !== 'string') {
    return {
      props: {
        searchValue: '',
        ...(await serverSideTranslations(locale as string, ['common'])),
      }
    };
  }

  try {
    const { NotionClient } = await import('lib/notion/Notion');
    const notionClient: InstanceType<typeof NotionClient> = new NotionClient();
    const [databaseResult, workspaceResult]: [NotionSearch['results'], NotionSearch['results']] =
      await Promise.all([
      notionClient.getSearchPagesByDatabase({
        direction: 'descending',
        searchValue: slug
      }),
      notionClient.getSearchPagesByWorkspace({
        direction: 'descending',
        searchValue: slug
      })
    ]);

    const resultRecord: Record<string, NotionSearch['results'][number]> = {};

    for (const database of databaseResult) {
      resultRecord[database.id] = database;
    }
    for (const workspace of workspaceResult) {
      resultRecord[workspace.id] = workspace;
    }
    const result: NotionSearch['results'] = Object.values(resultRecord);

    return {
      props: {
        searchValue: slug,
        searchResult: result,
        ...(await serverSideTranslations(locale as string, ['common']))
      }
    };
  } catch {
    return { notFound: true };
  }
};
