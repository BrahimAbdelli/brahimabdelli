/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ChildDatabase } from '../ChildDatabase';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('src/store/notion');
jest.mock('next/navigation', () => ({
  usePathname: () => '/test-path'
}));

jest.mock('../ChildDatabaseItem', () => ({
  ChildDatabaseItem: ({ block }: { block: any }) => (
    <div data-testid='child-database-item'>{block.title || 'Untitled'}</div>
  )
}));

const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;

describe('ChildDatabase Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'database-id',
    type: 'child_database',
    child_database: {
      title: 'Test Database'
    }
  } as NotionBlocksRetrieve;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders database title', () => {
    mockUseNotionStore.mockReturnValue({
      databasesRecord: {
        'database-id': {
          results: [],
          title: [{ plain_text: 'Test Database', type: 'text' }]
        }
      }
    } as any);
    render(<ChildDatabase block={mockBlock} />);
    expect(screen.getByText('Test Database')).toBeInTheDocument();
  });

  it('renders database items when available', () => {
    mockUseNotionStore.mockReturnValue({
      databasesRecord: {
        'database-id': {
          results: [
            {
              id: 'item-1',
              properties: {
                title: {
                  type: 'title',
                  title: [{ plain_text: 'Item 1', type: 'text' }]
                }
              }
            }
          ]
        }
      }
    } as any);
    render(<ChildDatabase block={mockBlock} />);
    expect(screen.getByTestId('child-database-item')).toBeInTheDocument();
  });

  it('renders empty state when no items', () => {
    mockUseNotionStore.mockReturnValue({
      databasesRecord: {
        'database-id': {
          results: []
        }
      }
    } as any);
    render(<ChildDatabase block={mockBlock} />);
    expect(screen.queryByTestId('child-database-item')).not.toBeInTheDocument();
  });

  it('handles missing database record gracefully', () => {
    mockUseNotionStore.mockReturnValue({
      databasesRecord: {}
    } as any);
    const { container } = render(<ChildDatabase block={mockBlock} />);
    expect(container).toBeInTheDocument();
  });
});

