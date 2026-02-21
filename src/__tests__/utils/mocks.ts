import type { NextRouter } from 'next/router';

export const createMockRouter = (overrides: Partial<NextRouter> = {}): Partial<NextRouter> => ({
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  ...overrides
});

export const createMockUseRouter = (overrides: Partial<NextRouter> = {}): jest.Mock => {
  return jest.fn((): Partial<NextRouter> => createMockRouter(overrides));
};

export const createMockIntersectionObserver = (): typeof IntersectionObserver => {
  return class MockIntersectionObserver implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];

    disconnect = jest.fn<void, []>();
    observe = jest.fn<void, [Element]>();
    takeRecords = jest.fn<IntersectionObserverEntry[], []>(() => []);
    unobserve = jest.fn<void, [Element]>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-useless-constructor
    constructor(
      _callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit
    ) {
      // Mock implementation - constructor required by IntersectionObserver interface
    }
  } as unknown as typeof IntersectionObserver;
};

export const createMockMatchMedia = (matches: boolean = false): typeof globalThis.matchMedia => {
  return jest.fn((query: string): MediaQueryList => {
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    } as unknown as MediaQueryList;
  });
};

export const createMockTranslation = (): {
  t: jest.Mock<string, [string]>;
  i18n: {
    changeLanguage: jest.Mock<void, [string]>;
    language: string;
    languages: string[];
    getFixedT: jest.Mock<jest.Mock<string, [string]>, [string]>;
  };
  ready: boolean;
} => ({
  t: jest.fn((key: string): string => key),
  i18n: {
    changeLanguage: jest.fn(),
    language: 'en',
    languages: ['en'],
    getFixedT: jest.fn((key: string): jest.Mock<string, [string]> =>
      jest.fn((subKey: string): string => `${key}.${subKey}`)
    )
  },
  ready: true
});

