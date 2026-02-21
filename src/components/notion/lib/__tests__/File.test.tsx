import { render, screen } from '@testing-library/react';
import { File } from '../File';
import { useRenewExpiredFile } from '../utils';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('../utils');

const mockUseRenewExpiredFile = useRenewExpiredFile as jest.MockedFunction<typeof useRenewExpiredFile>;

describe('File Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'file',
    file: {
      type: 'file',
      file: {
        url: 'https://example.com/file.pdf',
        expiry_time: new Date(Date.now() + 10000).toISOString()
      }
    }
  } as NotionBlocksRetrieve;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRenewExpiredFile.mockReturnValue({
      data: mockBlock.file,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false
    } as any);
  });

  it('renders file link', () => {
    render(<File block={mockBlock} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('renders file with external URL', () => {
    const externalBlock: NotionBlocksRetrieve = {
      id: 'test-id',
      type: 'file',
      file: {
        type: 'external',
        external: {
          url: 'https://example.com/file.pdf'
        }
      }
    } as NotionBlocksRetrieve;
    mockUseRenewExpiredFile.mockReturnValue({
      data: externalBlock.file,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false
    } as any);
    render(<File block={externalBlock} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/file.pdf');
  });

  it('renders file with caption when provided', () => {
    const blockWithCaption: NotionBlocksRetrieve = {
      ...mockBlock,
      file: {
        ...mockBlock.file!,
        caption: [
          {
            plain_text: 'File caption',
            type: 'text',
            text: { content: 'File caption' },
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
    } as NotionBlocksRetrieve;
    render(<File block={blockWithCaption} />);
    expect(screen.getByText('File caption')).toBeInTheDocument();
  });

  it('returns null when file is not available', () => {
    mockUseRenewExpiredFile.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false
    } as any);
    const { container } = render(<File block={mockBlock} />);
    expect(container.firstChild).toBeNull();
  });
});





