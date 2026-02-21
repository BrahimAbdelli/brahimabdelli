import { render, screen } from '@testing-library/react';
import { BlocksRender } from '../BlocksRender';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('../index', () => ({
  NotionParagraphBlock: ({ richText }: { richText: any[] }) => (
    <div>{richText?.[0]?.plain_text || 'Paragraph'}</div>
  ),
  NotionHeadingBlock: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div>Heading {block.type}</div>
  ),
  NotionCodeBlock: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div>Code {block.code?.language}</div>
  ),
  NotionCalloutBlock: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div>Callout</div>
  ),
  NotionListBlock: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div>List {block.type}</div>
  ),
  NotionQuoteBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>Quote</div>,
  NotionImageBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>Image</div>,
  NotionFileBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>File</div>,
  NotionLinkPreviewBlock: ({ url }: { url: string }) => <div>LinkPreview {url}</div>,
  NotionTodoBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>Todo</div>,
  NotionToggleBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>Toggle</div>,
  NotionTableBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>Table</div>,
  NotionTableOfContents: () => <div>TableOfContents</div>,
  NotionColumnListBlock: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div>ColumnList</div>
  ),
  NotionChildDatabaseBlock: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div>ChildDatabase</div>
  ),
  NotionSyncedBlock: ({ block }: { block: NotionBlocksRetrieve }) => <div>Synced</div>,
  NotionHasChildrenRender: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

describe('BlocksRender Component', () => {
  it('renders paragraph block', () => {
    const blocks: NotionBlocksRetrieve[] = [
      {
        id: 'test-id',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              plain_text: 'Test paragraph',
              type: 'text',
              text: { content: 'Test paragraph' },
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
        }
      }
    ] as NotionBlocksRetrieve[];
    render(<BlocksRender blocks={blocks} />);
    expect(screen.getByText('Test paragraph')).toBeInTheDocument();
  });

  it('renders heading blocks', () => {
    const blocks: NotionBlocksRetrieve[] = [
      {
        id: 'test-id',
        type: 'heading_1',
        heading_1: {
          rich_text: [],
          color: 'default'
        }
      }
    ] as NotionBlocksRetrieve[];
    render(<BlocksRender blocks={blocks} />);
    expect(screen.getByText('Heading heading_1')).toBeInTheDocument();
  });

  it('renders code block', () => {
    const blocks: NotionBlocksRetrieve[] = [
      {
        id: 'test-id',
        type: 'code',
        code: {
          language: 'javascript',
          rich_text: [],
          caption: []
        }
      }
    ] as NotionBlocksRetrieve[];
    render(<BlocksRender blocks={blocks} />);
    expect(screen.getByText('Code javascript')).toBeInTheDocument();
  });

  it('renders multiple blocks', () => {
    const blocks: NotionBlocksRetrieve[] = [
      {
        id: 'test-id-1',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              plain_text: 'First paragraph',
              type: 'text',
              text: { content: 'First paragraph' },
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
        }
      },
      {
        id: 'test-id-2',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              plain_text: 'Second paragraph',
              type: 'text',
              text: { content: 'Second paragraph' },
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
        }
      }
    ] as NotionBlocksRetrieve[];
    render(<BlocksRender blocks={blocks} />);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders divider', () => {
    const blocks: NotionBlocksRetrieve[] = [
      {
        id: 'test-id',
        type: 'divider',
        divider: {}
      }
    ] as NotionBlocksRetrieve[];
    const { container } = render(<BlocksRender blocks={blocks} />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('renders bookmark block', () => {
    const blocks: NotionBlocksRetrieve[] = [
      {
        id: 'test-id',
        type: 'bookmark',
        bookmark: {
          url: 'https://example.com',
          caption: []
        }
      }
    ] as NotionBlocksRetrieve[];
    render(<BlocksRender blocks={blocks} />);
    expect(screen.getByText('LinkPreview https://example.com')).toBeInTheDocument();
  });
});





