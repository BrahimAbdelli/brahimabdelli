import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';
import { useThemeStore } from 'src/store/theme';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { NotionZustandContext, initializeNotionStore } from 'src/store/notion';

jest.mock('src/store/theme');
jest.mock('src/store/siteSetting');
jest.mock('nextjs-progressbar', () => ({
  __esModule: true,
  default: () => null
}));

const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;
const mockUseSiteSettingStore = useSiteSettingStore as jest.MockedFunction<typeof useSiteSettingStore>;

describe('Layout Component', () => {
  const notionStore = initializeNotionStore({
    baseBlock: { results: [] },
    pageInfo: undefined,
    userInfo: undefined
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <NotionZustandContext.Provider value={notionStore}>
        {component}
      </NotionZustandContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseThemeStore.mockImplementation((selector?: any) => {
      const state = { mode: 'light', changeTheme: jest.fn() };
      return typeof selector === 'function' ? selector(state) : state;
    });
    mockUseSiteSettingStore.mockReturnValue({
      hydrated: true,
      enableSideBarMenu: false,
      closeSideBarMenu: jest.fn(),
      openSideBarMenu: jest.fn(),
      setHydrated: jest.fn()
    } as any);
  });

  it('renders children', () => {
    renderWithProvider(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    renderWithProvider(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    // Header should be rendered (checking for navigation or search)
    expect(screen.getByLabelText('search-input')).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    renderWithProvider(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    // Footer should be rendered
    expect(screen.getByRole('contentinfo') || screen.getByText(/Test Blog/i)).toBeInTheDocument();
  });

  it('renders SideBarMenu component', () => {
    const { container } = renderWithProvider(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    // SideBarMenu should be rendered
    expect(container.querySelector('[class*="fixed"]')).toBeInTheDocument();
  });

  it('applies theme class to document', () => {
    mockUseThemeStore.mockImplementation((selector?: any) => {
      const state = { mode: 'dark', changeTheme: jest.fn() };
      return typeof selector === 'function' ? selector(state) : state;
    });
    renderWithProvider(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('renders scroll top button', () => {
    const { container } = renderWithProvider(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    const scrollButton = container.querySelector('button[tabIndex="-1"]');
    expect(scrollButton).toBeInTheDocument();
  });
});


