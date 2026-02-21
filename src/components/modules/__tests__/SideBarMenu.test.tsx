import { render, screen, fireEvent } from '@testing-library/react';
import { SideBarMenu } from '../SideBarMenu';
import { useNotionStore } from 'src/store/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';

jest.mock('src/store/notion');
jest.mock('src/store/siteSetting');

const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;
const mockUseSiteSettingStore = useSiteSettingStore as jest.MockedFunction<typeof useSiteSettingStore>;

describe('SideBarMenu Component', () => {
  const mockCloseSideBarMenu = jest.fn();
  const mockOpenSideBarMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSiteSettingStore.mockReturnValue({
      enableSideBarMenu: false,
      closeSideBarMenu: mockCloseSideBarMenu,
      openSideBarMenu: mockOpenSideBarMenu
    } as any);
  });

  it('renders nothing when blogProperties is not available', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = { blogProperties: undefined };
      return typeof selector === 'function' ? selector(state) : state;
    });
    const { container } = render(<SideBarMenu />);
    expect(container.firstChild).toBeNull();
  });

  it('renders sidebar menu when blogProperties is available', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        blogProperties: {
          categories: [{ id: '1', name: 'Category 1', count: 5 }],
          tags: [{ id: '1', name: 'Tag 1', color: 'blue' }]
        }
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<SideBarMenu />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('renders categories list', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        blogProperties: {
          categories: [{ id: '1', name: 'Category 1', count: 5 }],
          tags: []
        }
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<SideBarMenu />);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('renders tags list', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        blogProperties: {
          categories: [],
          tags: [{ id: '1', name: 'Tag 1', color: 'blue' }]
        }
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<SideBarMenu />);
    expect(screen.getByText('Tag 1')).toBeInTheDocument();
  });

  it('closes menu when backdrop is clicked', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        blogProperties: {
          categories: [] as any[],
          tags: [] as any[]
        }
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    mockUseSiteSettingStore.mockReturnValue({
      enableSideBarMenu: true,
      closeSideBarMenu: mockCloseSideBarMenu,
      openSideBarMenu: mockOpenSideBarMenu
    } as any);
    const { container } = render(<SideBarMenu />);
    const backdrop: HTMLElement | null = container.querySelector('.fixed > .absolute.top-0');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) fireEvent.click(backdrop);
    expect(mockCloseSideBarMenu).toHaveBeenCalled();
  });

  it('toggles menu when button is clicked', () => {
    mockUseNotionStore.mockImplementation((selector) => {
      const state = {
        blogProperties: {
          categories: [] as any[],
          tags: [] as any[]
        }
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
    render(<SideBarMenu />);
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find((btn) => btn.textContent === '');
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(mockOpenSideBarMenu).toHaveBeenCalled();
    }
  });
});


