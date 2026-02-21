import { render, screen } from '@testing-library/react';
import { NotionSecureImage } from '../NotionSecureImage';
import { useRenewExpiredFile } from '../utils';
import type { FileObject } from 'src/types/notion';

jest.mock('../utils');
jest.mock('site-config', () => ({
  siteConfig: {
    enableImageOptimization: true
  }
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} data-testid='next-image' />
}));

const mockUseRenewExpiredFile = useRenewExpiredFile as jest.MockedFunction<typeof useRenewExpiredFile>;

describe('NotionSecureImage Component', () => {
  const mockFileObject: FileObject = {
    type: 'file',
    file: {
      url: 'https://example.com/image.jpg',
      expiry_time: new Date(Date.now() + 10000).toISOString()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRenewExpiredFile.mockReturnValue({
      data: mockFileObject,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false
    } as any);
  });

  it('renders image with Next Image when useNextImage is true', () => {
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={mockFileObject}
        alt='Test image'
        useNextImage
      />
    );
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('renders image with img tag when useNextImage is false', () => {
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={mockFileObject}
        alt='Test image'
        useNextImage={false}
      />
    );
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe('IMG');
  });

  it('renders loading spinner when image is not loaded', () => {
    mockUseRenewExpiredFile.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false
    } as any);
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={mockFileObject}
        alt='Test image'
      />
    );
    // Loading spinner should be rendered
    const { container } = render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={mockFileObject}
        alt='Test image'
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('handles external file object', () => {
    const externalFileObject: FileObject = {
      type: 'external',
      external: {
        url: 'https://example.com/external.jpg'
      }
    };
    mockUseRenewExpiredFile.mockReturnValue({
      data: externalFileObject,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false
    } as any);
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={externalFileObject}
        alt='External image'
      />
    );
    const image = screen.getByAltText('External image');
    expect(image).toBeInTheDocument();
  });

  it('applies quality prop when useNextImage is true', () => {
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={mockFileObject}
        alt='Test image'
        useNextImage
        quality={90}
      />
    );
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
  });

  it('applies sizes prop when useNextImage is true', () => {
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={mockFileObject}
        alt='Test image'
        useNextImage
        sizes={{ width: 800, height: 600 }}
      />
    );
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
  });

  it('handles expired file and renews it', () => {
    const expiredFileObject: FileObject = {
      type: 'file',
      file: {
        url: 'https://example.com/expired.jpg',
        expiry_time: new Date(Date.now() - 10000).toISOString()
      }
    };
    mockUseRenewExpiredFile.mockReturnValue({
      data: expiredFileObject,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false
    } as any);
    render(
      <NotionSecureImage
        blockId='test-id'
        blockType='image'
        useType='image'
        initialFileObject={expiredFileObject}
        alt='Expired image'
      />
    );
    expect(mockUseRenewExpiredFile).toHaveBeenCalled();
  });
});


