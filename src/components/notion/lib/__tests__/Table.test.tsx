import { render, screen } from '@testing-library/react';
import { Table } from '../Table';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('src/store/notion');
jest.mock('../index', () => ({
  NotionParagraphBlock: ({ richText }: { richText: any[] }) => (
    <div>{richText?.[0]?.plain_text || 'Cell'}</div>
  )
}));

const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;

describe('Table Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'table-id',
    type: 'table',
    table: {
      table_width: 2,
      has_column_header: true,
      has_row_header: false
    }
  } as NotionBlocksRetrieve;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with rows and cells', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'table-id': {
          results: [
            {
              id: 'row-1',
              type: 'table_row',
              table_row: {
                cells: [
                  [
                    {
                      plain_text: 'Cell 1-1',
                      type: 'text',
                      text: { content: 'Cell 1-1' },
                      annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: 'default'
                      }
                    }
                  ],
                  [
                    {
                      plain_text: 'Cell 1-2',
                      type: 'text',
                      text: { content: 'Cell 1-2' },
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
                ]
              }
            }
          ]
        }
      }
    } as any);
    render(<Table block={mockBlock} />);
    expect(screen.getByText('Cell 1-1')).toBeInTheDocument();
    expect(screen.getByText('Cell 1-2')).toBeInTheDocument();
  });

  it('returns null when table is not available', () => {
    const blockWithoutTable: NotionBlocksRetrieve = {
      id: 'table-id',
      type: 'table',
      table: undefined
    } as any;
    const { container } = render(<Table block={blockWithoutTable} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when tbodyBlock is not available', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {}
    } as any);
    const { container } = render(<Table block={mockBlock} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies column header styles when has_column_header is true', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'table-id': {
          results: [
            {
              id: 'row-1',
              type: 'table_row',
              table_row: {
                cells: [[{ plain_text: 'Header', type: 'text', text: { content: 'Header' }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }]]
              }
            }
          ]
        }
      }
    } as any);
    const { container } = render(<Table block={mockBlock} />);
    const table = container.querySelector('table');
    expect(table?.className).toContain('bg-notion-gray/50');
  });

  it('applies row header styles when has_row_header is true', () => {
    const blockWithRowHeader: NotionBlocksRetrieve = {
      ...mockBlock,
      table: {
        ...mockBlock.table!,
        has_row_header: true
      }
    };
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'table-id': {
          results: [
            {
              id: 'row-1',
              type: 'table_row',
              table_row: {
                cells: [[{ plain_text: 'Row Header', type: 'text', text: { content: 'Row Header' }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }]]
              }
            }
          ]
        }
      }
    } as any);
    const { container } = render(<Table block={blockWithRowHeader} />);
    const table = container.querySelector('table');
    expect(table?.className).toContain('bg-notion-gray/50');
  });

  it('renders multiple rows', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'table-id': {
          results: [
            {
              id: 'row-1',
              type: 'table_row',
              table_row: {
                cells: [
                  [
                    {
                      plain_text: 'Row 1 Cell 1',
                      type: 'text',
                      text: { content: 'Row 1 Cell 1' },
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
                ]
              }
            },
            {
              id: 'row-2',
              type: 'table_row',
              table_row: {
                cells: [
                  [
                    {
                      plain_text: 'Row 2 Cell 1',
                      type: 'text',
                      text: { content: 'Row 2 Cell 1' },
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
                ]
              }
            }
          ]
        }
      }
    } as any);
    render(<Table block={mockBlock} />);
    expect(screen.getByText('Row 1 Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Cell 1')).toBeInTheDocument();
  });
});





