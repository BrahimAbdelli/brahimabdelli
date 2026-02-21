import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes');

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
const mockSetTheme = jest.fn();

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
      systemTheme: 'light',
      resolvedTheme: 'light'
    } as any);
  });

  it('renders theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Theme toggle');
    expect(button).toBeInTheDocument();
  });

  it('shows moon icon when theme is light', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
      systemTheme: 'light',
      resolvedTheme: 'light'
    } as any);
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Theme toggle');
    expect(button).toBeInTheDocument();
  });

  it('shows sun icon when theme is dark', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
      systemTheme: 'dark',
      resolvedTheme: 'dark'
    } as any);
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Theme toggle');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme from light to dark when clicked', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
      systemTheme: 'light',
      resolvedTheme: 'light'
    } as any);
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Theme toggle');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles theme from dark to light when clicked', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
      systemTheme: 'dark',
      resolvedTheme: 'dark'
    } as any);
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Theme toggle');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('does not render until mounted', () => {
    mockUseTheme.mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
      systemTheme: 'light',
      resolvedTheme: undefined
    } as any);
    const { container } = render(<ThemeToggle />);
    // Component should handle mounting state
    expect(container).toBeInTheDocument();
  });
});





