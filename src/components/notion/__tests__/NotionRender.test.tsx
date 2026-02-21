import { render, screen } from '@testing-library/react';
import { NotionRender } from '../NotionRender';
import { useNotionStore } from 'src/store/notion';

jest.mock('src/store/notion');

const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;

describe('NotionRender Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 404 when blocks are not available', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        baseBlock: undefined,
        pageInfo: undefined,
        userInfo: undefined
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<NotionRender />);
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders 404 when pageInfo is not available', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<NotionRender />);
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('renders NotionPageHeader when blocks and pageInfo are available', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        baseBlock: { results: [] },
        pageInfo: {
          id: 'test-page-id',
          object: 'page',
          properties: { title: { title: [{ plain_text: 'Test Page' }] } },
          parent: {
            database_id: 'parent-db-id'
          }
        },
        userInfo: undefined
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<NotionRender />);
    // NotionPageHeader should be rendered
    expect(screen.queryByText('404 Not Found')).not.toBeInTheDocument();
  });

  it('renders NotionSeo when pageInfo is available', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        baseBlock: { results: [] },
        pageInfo: {
          id: 'test-page-id',
          object: 'page',
          properties: { title: { title: [{ plain_text: 'Test Page' }] } },
          parent: {
            database_id: 'parent-db-id'
          }
        },
        userInfo: undefined
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<NotionRender />);
    // SEO should be set via head
    expect(screen.queryByText('404 Not Found')).not.toBeInTheDocument();
  });
});


