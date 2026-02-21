import { render, screen } from '@testing-library/react';
import { ColumnList } from '../ColumnList';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('src/store/notion');

const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;

jest.mock('../index', () => ({
  NotionBlocksRender: ({ blocks }: { blocks: NotionBlocksRetrieve[] }) => (
    <div>{blocks.length} blocks</div>
  )
}));

describe('ColumnList Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'column-list-id',
    type: 'column_list',
    column_list: {}
  } as NotionBlocksRetrieve;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders column list', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'column-list-id': {
          results: [
            {
              id: 'column-1',
              type: 'column',
              column: {}
            },
            {
              id: 'column-2',
              type: 'column',
              column: {}
            }
          ]
        },
        'column-1': {
          results: [
            {
              id: 'block-1',
              type: 'paragraph',
              paragraph: { rich_text: [] }
            }
          ]
        },
        'column-2': {
          results: [
            {
              id: 'block-2',
              type: 'paragraph',
              paragraph: { rich_text: [] }
            }
          ]
        }
      }
    } as any);
    render(<ColumnList block={mockBlock} />);
    expect(screen.getAllByText('1 blocks').length).toBe(2);
  });

  it('renders empty column list when no columns', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'column-list-id': {
          results: []
        }
      }
    } as any);
    const { container } = render(<ColumnList block={mockBlock} />);
    const columnList = container.querySelector('div');
    expect(columnList).toBeInTheDocument();
  });

  it('applies grid template columns based on column count', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'column-list-id': {
          results: [
            { id: 'column-1', type: 'column', column: {} },
            { id: 'column-2', type: 'column', column: {} },
            { id: 'column-3', type: 'column', column: {} }
          ]
        },
        'column-1': { results: [] },
        'column-2': { results: [] },
        'column-3': { results: [] }
      }
    } as any);
    const { container } = render(<ColumnList block={mockBlock} />);
    const columnList = container.querySelector('div');
    expect(columnList?.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });

  it('handles missing children record gracefully', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {}
    } as any);
    const { container } = render(<ColumnList block={mockBlock} />);
    const columnList = container.querySelector('div');
    expect(columnList).toBeInTheDocument();
    expect(columnList?.style.gridTemplateColumns).toBe('repeat(1, 1fr)');
  });
});





