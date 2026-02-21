import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';
import { ThemeChangeButton } from '../ThemeChangeButton';
import { useThemeStore } from 'src/store/theme';
import * as React from 'react';

jest.mock('src/store/theme');

const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;

describe('ThemeChangeButton Component', () => {
  const mockChangeTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseThemeStore.mockReturnValue({
      mode: 'light',
      changeTheme: mockChangeTheme
    } as any);
  });

  it('renders theme change button after hydration', async () => {
    render(<ThemeChangeButton />);
    await waitFor(() => {
      expect(screen.getByLabelText('theme-mode-change-button')).toBeInTheDocument();
    });
  });

  it('toggles theme from light to dark when clicked', async () => {
    mockUseThemeStore.mockReturnValue({
      mode: 'light',
      changeTheme: mockChangeTheme
    } as any);
    render(<ThemeChangeButton />);
    await waitFor(() => {
      const button = screen.getByLabelText('theme-mode-change-button');
      fireEvent.click(button.closest('label')!);
      expect(mockChangeTheme).toHaveBeenCalledWith('dark');
    });
  });

  it('toggles theme from dark to light when clicked', async () => {
    mockUseThemeStore.mockReturnValue({
      mode: 'dark',
      changeTheme: mockChangeTheme
    } as any);
    render(<ThemeChangeButton />);
    await waitFor(() => {
      const button = screen.getByLabelText('theme-mode-change-button');
      fireEvent.click(button.closest('label')!);
      expect(mockChangeTheme).toHaveBeenCalledWith('light');
    });
  });

  it('shows placeholder div before hydration', () => {
    const html = ReactDOMServer.renderToString(<ThemeChangeButton />);
    expect(html).toContain('w-8');
  });
});





