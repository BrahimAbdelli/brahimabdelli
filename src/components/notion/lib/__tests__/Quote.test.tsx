import { render, screen } from '@testing-library/react';
import { Quote } from '../Quote';
import type { NotionBlocksRetrieve } from 'src/types/notion';

describe('Quote Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'quote',
    quote: {
      rich_text: [
        {
          plain_text: 'Quote text',
          type: 'text',
          text: { content: 'Quote text' },
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
  } as NotionBlocksRetrieve;

  it('renders quote text', () => {
    render(<Quote block={mockBlock} />);
    expect(screen.getByText('Quote text')).toBeInTheDocument();
  });

  it('renders quote with correct structure', () => {
    const { container } = render(<Quote block={mockBlock} />);
    const quote = container.querySelector('blockquote');
    expect(quote).toBeInTheDocument();
  });

  it('renders quote with color', () => {
    const { container } = render(<Quote block={mockBlock} />);
    const quote = container.querySelector('blockquote');
    expect(quote?.className).toBeTruthy();
  });
});





