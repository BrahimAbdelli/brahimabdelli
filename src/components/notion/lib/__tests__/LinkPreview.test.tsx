/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';

import { LinkPreview } from '../LinkPreview';
import type { LinkPreview as ILinkPreview } from 'src/types/types';

// Mock dependencies
jest.mock('swr', () => {
  return jest.fn();
});

jest.mock('site-config', () => ({
  siteConfig: {
    path: '/api'
  }
}));

jest.mock('src/lib/notion', () => ({
  notionBlockUrlToRelativePath: jest.fn((url: string) => `/relative/${url}`)
}));

// Mock NotionParagraphText from Paragraph component
jest.mock('../Paragraph', () => {
  const actual = jest.requireActual('../Paragraph');
  return {
    ...actual,
    ParagraphText: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    )
  };
});

describe('LinkPreview Component', () => {
  const mockUrl = 'https://example.com';
  const mockSWR = require('swr');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when isValidating is true', () => {
    mockSWR.mockReturnValue({
      data: {
        username: null,
        description: null,
        icon: null,
        image: { alt: null, url: null },
        media: null,
        title: null,
        type: null
      },
      error: undefined,
      isValidating: true
    });

    const { container } = render(<LinkPreview url={mockUrl} />);

    // Check for loading spinner SVGs (they have animate-spin class)
    const loadingSpinners = container.querySelectorAll('.animate-spin');
    expect(loadingSpinners.length).toBeGreaterThan(0);
  });

  it('renders error state with simple link when error occurs', () => {
    mockSWR.mockReturnValue({
      data: {
        username: null,
        description: null,
        icon: null,
        image: { alt: null, url: null },
        media: null,
        title: null,
        type: null
      },
      error: new Error('Failed to fetch'),
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/relative/${mockUrl}`);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
    expect(link).toHaveClass('underline');
    expect(screen.getByText(mockUrl)).toBeInTheDocument();
  });

  it('renders link preview with title and description', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: 'This is an example description',
      icon: 'https://example.com/favicon.ico',
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Example image'
      },
      media: null,
      type: 'website',
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/relative/${mockUrl}`);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');

    expect(screen.getByText('Example Site')).toBeInTheDocument();
    expect(screen.getByText('This is an example description')).toBeInTheDocument();
  });

  it('renders icon when available', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: null,
      icon: 'https://example.com/favicon.ico',
      image: { alt: null, url: null },
      media: null,
      type: null,
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    const icon = screen.getByAltText('Example Site-favicon');
    expect(icon).toHaveAttribute('src', 'https://example.com/favicon.ico');
  });

  it('renders fallback icon when icon is not available', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: null,
      icon: null,
      image: { alt: null, url: null },
      media: null,
      type: null,
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    // The link icon should be rendered (it's an SVG, so we check for the URL text)
    expect(screen.getByText(mockUrl)).toBeInTheDocument();
  });

  it('renders image when available', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: null,
      icon: null,
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Example image'
      },
      media: null,
      type: null,
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    const image = screen.getByAltText('Example image');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('handles relative icon URL correctly', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: null,
      icon: '/favicon.ico',
      image: { alt: null, url: null },
      media: null,
      type: null,
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    const icon = screen.getByAltText('Example Site-favicon');
    const expectedUrl = new URL('/favicon.ico', mockUrl).href;
    expect(icon).toHaveAttribute('src', expectedUrl);
  });

  it('handles relative image URL correctly', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: null,
      icon: null,
      image: {
        url: '/image.jpg',
        alt: 'Example image'
      },
      media: null,
      type: null,
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    const image = screen.getByAltText('Example image');
    const expectedUrl = new URL('/image.jpg', mockUrl).href;
    expect(image).toHaveAttribute('src', expectedUrl);
  });

  it('does not render image section when image URL is not available and not loading', () => {
    const mockData: ILinkPreview = {
      title: 'Example Site',
      description: null,
      icon: null,
      image: { alt: null, url: null },
      media: null,
      type: null,
      username: null
    };

    mockSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    // Should not have image figure
    const images = screen.queryAllByRole('img');
    // Only the icon (if any), no preview image
    expect(images.length).toBe(0);
  });

  it('calls useSWR with correct parameters', () => {
    mockSWR.mockReturnValue({
      data: {
        username: null,
        description: null,
        icon: null,
        image: { alt: null, url: null },
        media: null,
        title: null,
        type: null
      },
      error: undefined,
      isValidating: false
    });

    render(<LinkPreview url={mockUrl} />);

    expect(mockSWR).toHaveBeenCalledWith(
      `/api/linkPreview/${encodeURIComponent(mockUrl)}`,
      expect.any(Function),
      expect.objectContaining({
        fallbackData: expect.any(Object),
        revalidateOnFocus: false
      })
    );
  });
});

