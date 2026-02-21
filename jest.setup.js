import '@testing-library/jest-dom';

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => children,
  Light: ({ children }) => children,
}));
jest.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  oneDark: {},
  oneLight: {},
  materialDark: {},
  materialLight: {},
  prism: {},
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
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
      isPreview: false
    };
  },
  withRouter(component) {
    component.defaultProps = {
      ...component.defaultProps,
      router: {
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/'
      }
    };
    return component;
  }
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/'
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  }
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en'
    }
  }),
  appWithTranslation: (component) => component
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
