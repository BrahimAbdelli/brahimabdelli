import { render, screen } from '@testing-library/react';
import { Paragraph, ParagraphText } from '../Paragraph';
import type { RichText } from 'src/types/notion';

describe('Paragraph Component', () => {
  const mockRichText: RichText[] = [
    {
      type: 'text',
      text: { content: 'Test paragraph', link: null },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: 'Test paragraph'
    }
  ];

  it('renders paragraph with rich text', () => {
    render(<Paragraph blockId='test-id' richText={mockRichText} />);
    expect(screen.getByText('Test paragraph')).toBeInTheDocument();
  });

  it('returns null when richText is not an array', () => {
    const { container } = render(
      <Paragraph blockId='test-id' richText={null as any} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders paragraph with heading link when provided', () => {
    render(<Paragraph blockId='test-id' richText={mockRichText} headingLink='#test' />);
    expect(screen.getByText('Test paragraph')).toBeInTheDocument();
  });

  it('renders paragraph with color', () => {
    const { container } = render(
      <Paragraph blockId='test-id' richText={mockRichText} color='blue' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders paragraph with annotations', () => {
    const annotatedText: RichText[] = [
      {
        ...mockRichText[0],
        annotations: {
          bold: true,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      }
    ];
    render(<Paragraph blockId='test-id' richText={annotatedText} />);
    expect(screen.getByText('Test paragraph')).toBeInTheDocument();
  });
});

describe('ParagraphText Component', () => {
  it('renders children', () => {
    render(<ParagraphText>Test text</ParagraphText>);
    expect(screen.getByText('Test text')).toBeInTheDocument();
  });

  it('applies bold class when bold prop is provided', () => {
    const { container } = render(<ParagraphText bold='true'>Bold text</ParagraphText>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('font-bold');
  });

  it('applies italic class when italic prop is provided', () => {
    const { container } = render(<ParagraphText italic='true'>Italic text</ParagraphText>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('italic');
  });

  it('applies strikethrough class when strikethrough prop is provided', () => {
    const { container } = render(
      <ParagraphText strikethrough='true'>Strikethrough text</ParagraphText>
    );
    const span = container.querySelector('span');
    expect(span?.className).toContain('line-through');
  });

  it('applies underline class when underline prop is provided', () => {
    const { container } = render(<ParagraphText underline='true'>Underline text</ParagraphText>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('underline');
  });

  it('applies code class when code prop is provided', () => {
    const { container } = render(<ParagraphText code='once'>Code text</ParagraphText>);
    const span = container.querySelector('span');
    expect(span?.className).toBeTruthy();
  });

  it('applies color class when color prop is provided', () => {
    const { container } = render(<ParagraphText color='blue'>Colored text</ParagraphText>);
    const span = container.querySelector('span');
    expect(span?.className).toBeTruthy();
  });
});





