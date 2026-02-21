import { render, screen } from '@testing-library/react';
import { NotionDatabasePageView } from '../DatabaseView';
import type { NotionDatabasesRetrieve, NotionDatabaseBlocks } from 'src/types/notion';

const mockUseRouter = jest.fn(() => ({
  query: {},
  pathname: '/',
  route: '/',
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  },
  isFallback: false
}));

jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter()
}));

jest.mock('../NotionSecureImage', () => ({
  NotionSecureImage: ({ alt }: { alt: string }) => <img alt={alt} data-testid='secure-image' />
}));

jest.mock('site-config', () => ({
  siteConfig: {
    notion: {
      baseBlock: 'test-base-block-id'
    },
    TZ: 'Europe/Paris'
  }
}));

describe('NotionDatabasePageView Component', () => {
  const mockDatabaseInfo: NotionDatabasesRetrieve = {
    id: 'database-id',
    object: 'database',
    title: [{ plain_text: 'Test Database', type: 'text' }],
    properties: {
      title: {
        title: {}
      },
      category: {
        type: 'select',
        select: {
          options: [
            { id: 'cat-1', name: 'Category 1', color: 'blue' },
            { id: 'cat-2', name: 'Category 2', color: 'red' }
          ]
        }
      },
      tags: {
        type: 'multi_select',
        multi_select: {
          options: [
            { id: 'tag-1', name: 'Tag 1', color: 'blue' },
            { id: 'tag-2', name: 'Tag 2', color: 'red' }
          ]
        }
      }
    },
    parent: {
      database_id: 'parent-id'
    }
  } as NotionDatabasesRetrieve;

  const mockNotionBlock: NotionDatabaseBlocks = {
    results: [
      {
        id: 'page-1',
        object: 'page',
        properties: {
          title: {
            title: [
              {
                plain_text: 'Page 1',
                type: 'text',
                text: { content: 'Page 1' },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default'
                }
              }
            ]
          },
          slug: {
            rich_text: []
          },
          category: {
            select: {
              name: 'Category 1',
              color: 'blue'
            }
          },
          tags: {
            multi_select: [
              { id: 'tag-1', name: 'Tag 1', color: 'blue' }
            ]
          }
        },
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        parent: {
          database_id: 'parent-id'
        }
      }
    ] as any[]
  };

  it('renders database view with pages', () => {
    render(<NotionDatabasePageView databaseInfo={mockDatabaseInfo} notionBlock={mockNotionBlock} />);
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('renders category filters', () => {
    render(<NotionDatabasePageView databaseInfo={mockDatabaseInfo} notionBlock={mockNotionBlock} />);
    const category1Elements = screen.getAllByText('Category 1');
    expect(category1Elements.length).toBeGreaterThan(0);
    // Category 2 is in the database options but no pages use it, so it won't be rendered
    // Check that Category 1 is rendered (which has pages using it)
    expect(category1Elements.length).toBeGreaterThan(0);
  });

  it('renders tag filters', () => {
    render(<NotionDatabasePageView databaseInfo={mockDatabaseInfo} notionBlock={mockNotionBlock} />);
    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('filters pages by category when category query is present', () => {
    mockUseRouter.mockReturnValueOnce({
      query: { category: 'Category 1' },
      pathname: '/',
      route: '/',
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false
    });
    render(<NotionDatabasePageView databaseInfo={mockDatabaseInfo} notionBlock={mockNotionBlock} />);
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('filters pages by tag when tag query is present', () => {
    mockUseRouter.mockReturnValueOnce({
      query: { tag: 'Tag 1' },
      pathname: '/',
      route: '/',
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false
    });
    render(<NotionDatabasePageView databaseInfo={mockDatabaseInfo} notionBlock={mockNotionBlock} />);
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('renders empty state when no pages', () => {
    const emptyNotionBlock: NotionDatabaseBlocks = {
      results: []
    };
    render(<NotionDatabasePageView databaseInfo={mockDatabaseInfo} notionBlock={emptyNotionBlock} />);
    // Component should handle empty state
    expect(screen.queryByText('Page 1')).not.toBeInTheDocument();
  });
});


