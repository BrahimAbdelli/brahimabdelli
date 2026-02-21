import { render, screen } from '@testing-library/react';
import { TableOfContents } from '../TableOfContents';
import type { NotionBlocksRetrieve } from 'src/types/notion';

describe('TableOfContents Component', () => {
  const mockBlocks: NotionBlocksRetrieve[] = [
    {
      id: 'heading-1',
      type: 'heading_1',
      heading_1: {
        rich_text: [
          {
            plain_text: 'Heading 1',
            type: 'text',
            text: { content: 'Heading 1' },
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
        color: 'default'
      }
    },
    {
      id: 'heading-2',
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            plain_text: 'Heading 2',
            type: 'text',
            text: { content: 'Heading 2' },
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
        color: 'default'
      }
    },
    {
      id: 'paragraph-1',
      type: 'paragraph',
      paragraph: {
        rich_text: []
      }
    }
  ] as NotionBlocksRetrieve[];

  const mockTableOfContentsBlock: NotionBlocksRetrieve = {
    id: 'toc-id',
    type: 'table_of_contents',
    table_of_contents: {
      color: 'default'
    }
  } as NotionBlocksRetrieve;

  it('renders table of contents with headings', () => {
    render(<TableOfContents blocks={mockBlocks} block={mockTableOfContentsBlock} />);
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
  });

  it('renders links to headings', () => {
    render(<TableOfContents blocks={mockBlocks} block={mockTableOfContentsBlock} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '#Heading%201');
  });

  it('filters only heading blocks', () => {
    render(<TableOfContents blocks={mockBlocks} block={mockTableOfContentsBlock} />);
    expect(screen.queryByText(/paragraph/i)).not.toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
  });

  it('applies padding based on heading level', () => {
    const { container } = render(
      <TableOfContents blocks={mockBlocks} block={mockTableOfContentsBlock} />
    );
    const divs = container.querySelectorAll('div[style]');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('renders empty table of contents when no headings', () => {
    const blocksWithoutHeadings: NotionBlocksRetrieve[] = [
      {
        id: 'paragraph-1',
        type: 'paragraph',
        paragraph: {
          rich_text: []
        }
      }
    ] as NotionBlocksRetrieve[];
    render(<TableOfContents blocks={blocksWithoutHeadings} block={mockTableOfContentsBlock} />);
    const links = screen.queryAllByRole('link');
    expect(links.length).toBe(0);
  });
});





