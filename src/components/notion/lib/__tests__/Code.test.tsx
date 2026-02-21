import { render, screen } from '@testing-library/react';
import { Code } from '../Code';
import { useThemeStore } from 'src/store/theme';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('src/store/theme');

const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;

describe('Code Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'code',
    code: {
      caption: [],
      language: 'javascript',
      rich_text: [{ plain_text: 'const test = "hello";', type: 'text', text: { content: 'const test = "hello";' }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }]
    }
  } as NotionBlocksRetrieve;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseThemeStore.mockReturnValue({
      mode: 'light'
    } as any);
  });

  it('renders code block with language', () => {
    render(<Code block={mockBlock} />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('renders code content', () => {
    const { container } = render(<Code block={mockBlock} />);
    expect(container.textContent).toContain('const test = "hello";');
  });

  it('renders code block with caption when provided', () => {
    const blockWithCaption: NotionBlocksRetrieve = {
      ...mockBlock,
      code: {
        ...mockBlock.code!,
        caption: [{ plain_text: 'Code caption', type: 'text', text: { content: 'Code caption' }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }]
      }
    } as NotionBlocksRetrieve;
    render(<Code block={blockWithCaption} />);
    expect(screen.getByText('Code caption')).toBeInTheDocument();
  });

  it('renders window controls', () => {
    render(<Code block={mockBlock} />);
    const controls = screen.getAllByRole('generic');
    expect(controls.length).toBeGreaterThan(0);
  });

  it('renders copy button wrapper', () => {
    const { container } = render(<Code block={mockBlock} />);
    const copyButton = container.querySelector('button');
    expect(copyButton).toBeInTheDocument();
  });
});


