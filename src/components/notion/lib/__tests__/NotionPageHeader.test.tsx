import { render, screen } from '@testing-library/react';
import { NotionPageHeader } from '../NotionPageHeader';
import type { GetNotionBlock, NotionUser } from 'src/types/notion';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />
}));

jest.mock('../NotionSecureImage', () => ({
  NotionSecureImage: ({ alt }: { alt: string }) => <img alt={alt} data-testid='secure-image' />
}));

describe('NotionPageHeader Component', () => {
  const mockPageInfo: GetNotionBlock['pageInfo'] = {
    id: 'test-id',
    object: 'page',
    properties: {
      title: {
        title: [
          {
            plain_text: 'Test Page',
            type: 'text',
            text: { content: 'Test Page' },
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
      tags: {
        multi_select: [
          { id: 'tag-1', name: 'Tag 1', color: 'blue' },
          { id: 'tag-2', name: 'Tag 2', color: 'red' }
        ]
      },
      publishedAt: {
        date: {
          start: '2024-01-01'
        }
      },
      category: {
        select: {
          name: 'Category 1',
          color: 'blue'
        }
      }
    },
    parent: {
      database_id: 'parent-db-id'
    },
    cover: undefined
  } as any;

  it('renders page title', () => {
    render(<NotionPageHeader pageInfo={mockPageInfo} title='Test Page' />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('renders tags when available', () => {
    render(<NotionPageHeader pageInfo={mockPageInfo} title='Test Page' />);
    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('renders category when available', () => {
    render(<NotionPageHeader pageInfo={mockPageInfo} title='Test Page' />);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
  });

  it('renders cover image when available', () => {
    const pageInfoWithCover: GetNotionBlock['pageInfo'] = {
      ...mockPageInfo,
      cover: {
        type: 'external',
        external: {
          url: 'https://example.com/cover.jpg'
        }
      }
    } as any;
    render(<NotionPageHeader pageInfo={pageInfoWithCover} title='Test Page' />);
    const image = screen.getByTestId('secure-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'page-cover');
  });

  it('renders user info when available', () => {
    const userInfo: NotionUser = {
      id: 'user-1',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      type: 'person'
    };
    render(<NotionPageHeader pageInfo={mockPageInfo} title='Test Page' userInfo={userInfo} />);
    const image = screen.getByAltText('Test User-avatar');
    expect(image).toBeInTheDocument();
  });

  it('renders published date when available', () => {
    render(<NotionPageHeader pageInfo={mockPageInfo} title='Test Page' />);
    // Date should be formatted and displayed
    expect(screen.getByText(/2024/i) || screen.getByText(/Jan/i)).toBeInTheDocument();
  });

  it('does not render cover when not available', () => {
    render(<NotionPageHeader pageInfo={mockPageInfo} title='Test Page' />);
    const image = screen.queryByTestId('secure-image');
    expect(image).not.toBeInTheDocument();
  });
});


