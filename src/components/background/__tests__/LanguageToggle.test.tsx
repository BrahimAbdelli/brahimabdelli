import { render, screen } from '@testing-library/react';
import LanguageToggle from '../LanguageToggle';

const mockUseRouter = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter()
}));

describe('LanguageToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      locale: 'en',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false
    } as any);
  });

  it('renders language toggle with both flags', () => {
    render(<LanguageToggle />);
    const toggle = screen.getByTestId('language-toggle');
    expect(toggle).toBeInTheDocument();
    expect(toggle.tagName.toLowerCase()).toBe('div');
    expect(screen.getByTestId('language-toggle-link-en')).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle-link-fr')).toBeInTheDocument();
  });

  it('shows US flag when locale is en', () => {
    mockUseRouter.mockReturnValueOnce({
      locale: 'en',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false
    } as any);
    render(<LanguageToggle />);
    expect(screen.getByTitle('English')).toBeInTheDocument();
  });

  it('shows FR flag when locale is fr', () => {
    mockUseRouter.mockReturnValueOnce({
      locale: 'fr',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false
    } as any);
    render(<LanguageToggle />);
    expect(screen.getByTitle('Français')).toBeInTheDocument();
  });

  it('renders links with correct href for slug routes', () => {
    mockUseRouter.mockReturnValueOnce({
      locale: 'en',
      pathname: '/[slug]',
      query: { slug: 'test-article' },
      asPath: '/test-article',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false
    } as any);
    render(<LanguageToggle />);
    const linkEn = screen.getByTestId('language-toggle-link-en');
    const linkFr = screen.getByTestId('language-toggle-link-fr');
    expect(linkEn.getAttribute('href')).toMatch(/test-article/);
    expect(linkFr.getAttribute('href')).toMatch(/test-article/);
  });
});


