import { render, screen } from '@testing-library/react';
import { Image } from '../Image';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('../NotionSecureImage', () => ({
  NotionSecureImage: ({ alt }: { alt: string }) => <img alt={alt} data-testid='notion-image' />
}));

describe('Image Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'image',
    image: {
      caption: [],
      type: 'external',
      external: {
        url: 'https://example.com/image.jpg'
      }
    }
  } as NotionBlocksRetrieve;

  it('renders image', () => {
    render(<Image block={mockBlock} />);
    const image = screen.getByTestId('notion-image');
    expect(image).toBeInTheDocument();
  });

  it('renders image with caption when provided', () => {
    const blockWithCaption: NotionBlocksRetrieve = {
      ...mockBlock,
      image: {
        ...mockBlock.image!,
        caption: [{ plain_text: 'Image caption', type: 'text', text: { content: 'Image caption' }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }]
      }
    } as NotionBlocksRetrieve;
    render(<Image block={blockWithCaption} />);
    expect(screen.getByText('Image caption')).toBeInTheDocument();
  });

  it('renders figure element', () => {
    const { container } = render(<Image block={mockBlock} />);
    const figure = container.querySelector('figure');
    expect(figure).toBeInTheDocument();
  });

  it('does not render caption when empty', () => {
    render(<Image block={mockBlock} />);
    const figcaption = screen.queryByText(/caption/i);
    expect(figcaption).not.toBeInTheDocument();
  });
});





