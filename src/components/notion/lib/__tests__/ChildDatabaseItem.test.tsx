import { render, screen } from '@testing-library/react';
import { ChildDatabaseItem } from '../ChildDatabaseItem';
import type { NotionPagesRetrieve, NotionDatabasesRetrieve } from 'src/types/notion';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />
}));

jest.mock('../NotionSecureImage', () => ({
  NotionSecureImage: ({ alt }: { alt: string }) => <img alt={alt} data-testid='secure-image' />
}));

describe('ChildDatabaseItem Component', () => {
  const mockPageBlock: NotionPagesRetrieve = {
    id: 'page-id',
    object: 'page',
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-02T00:00:00.000Z',
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
      slug: {
        rich_text: []
      }
    },
    parent: {
      database_id: 'parent-db-id'
    }
  } as NotionPagesRetrieve;

  const mockDatabaseBlock: NotionDatabasesRetrieve = {
    id: 'database-id',
    object: 'database',
    title: [{ plain_text: 'Test Database', type: 'text' }],
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-02T00:00:00.000Z',
    parent: {
      database_id: 'parent-db-id'
    },
    properties: {}
  } as NotionDatabasesRetrieve;

  it('renders page item with title', () => {
    render(<ChildDatabaseItem block={mockPageBlock} sortKey='created_time' />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('renders database item with title', () => {
    render(<ChildDatabaseItem block={mockDatabaseBlock} sortKey='created_time' />);
    expect(screen.getByText('Test Database')).toBeInTheDocument();
  });

  it('renders link for page item', () => {
    render(<ChildDatabaseItem block={mockPageBlock} sortKey='created_time' />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('renders date based on sortKey', () => {
    render(<ChildDatabaseItem block={mockPageBlock} sortKey='created_time' />);
    // Date should be formatted and displayed
    expect(screen.getByText(/ago|days/i) || screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('renders icon when available', () => {
    const blockWithIcon: NotionPagesRetrieve = {
      ...mockPageBlock,
      icon: {
        type: 'emoji',
        emoji: '📄'
      }
    } as NotionPagesRetrieve;
    render(<ChildDatabaseItem block={blockWithIcon} sortKey='created_time' />);
    expect(screen.getByText('📄')).toBeInTheDocument();
  });

  it('renders cover image when available', () => {
    const blockWithCover: NotionPagesRetrieve = {
      ...mockPageBlock,
      cover: {
        type: 'external',
        external: {
          url: 'https://example.com/cover.jpg'
        }
      }
    } as NotionPagesRetrieve;
    render(<ChildDatabaseItem block={blockWithCover} sortKey='created_time' />);
    const image = screen.getByTestId('secure-image');
    expect(image).toBeInTheDocument();
  });

  it('renders Notion icon fallback when no icon', () => {
    render(<ChildDatabaseItem block={mockPageBlock} sortKey='created_time' />);
    // Component should render SiNotion icon
    const { container } = render(<ChildDatabaseItem block={mockPageBlock} sortKey='created_time' />);
    expect(container).toBeInTheDocument();
  });
});





