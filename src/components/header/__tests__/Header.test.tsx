import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { useNotionStore } from 'src/store/notion';

jest.mock('src/store/siteSetting');
jest.mock('src/store/notion');
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    locale: 'en',
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
  })
}));

const mockUseSiteSettingStore = useSiteSettingStore as jest.MockedFunction<typeof useSiteSettingStore>;
const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;

describe('Header Component', () => {
  const mockCloseSideBarMenu = jest.fn();
  const mockOpenSideBarMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSiteSettingStore.mockReturnValue({
      hydrated: true,
      enableSideBarMenu: false,
      closeSideBarMenu: mockCloseSideBarMenu,
      openSideBarMenu: mockOpenSideBarMenu
    } as any);
    mockUseNotionStore.mockReturnValue({
      blogProperties: { blogname: 'Test Blog' }
    } as any);
  });

  it('renders header with navigation links', () => {
    render(<Header />);
    expect(screen.getByText('header.home')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
  });

  it('renders language toggle in header', () => {
    render(<Header />);
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
  });

  it('renders search form', () => {
    render(<Header />);
    expect(screen.getByLabelText('search-input')).toBeInTheDocument();
  });

  it('toggles sidebar menu when button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    expect(mockOpenSideBarMenu).toHaveBeenCalled();
  });

  it('closes sidebar menu when button is clicked and menu is open', () => {
    mockUseSiteSettingStore.mockReturnValue({
      hydrated: true,
      enableSideBarMenu: true,
      closeSideBarMenu: mockCloseSideBarMenu,
      openSideBarMenu: mockOpenSideBarMenu
    } as any);
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(menuButton);
    expect(mockCloseSideBarMenu).toHaveBeenCalled();
  });

  it('hides sidebar menu button when not hydrated', () => {
    mockUseSiteSettingStore.mockReturnValue({
      hydrated: false,
      enableSideBarMenu: false,
      closeSideBarMenu: mockCloseSideBarMenu,
      openSideBarMenu: mockOpenSideBarMenu
    } as any);
    render(<Header />);
    const menuButtons = screen.queryAllByRole('button');
    expect(menuButtons.length).toBeLessThan(3);
  });

  it('hides sidebar menu button when blogProperties is not available', () => {
    mockUseNotionStore.mockReturnValue({
      blogProperties: undefined
    } as any);
    render(<Header />);
    const menuButtons = screen.queryAllByRole('button');
    expect(menuButtons.length).toBeLessThan(3);
  });
});


