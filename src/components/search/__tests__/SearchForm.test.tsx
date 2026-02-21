import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchForm } from '../SearchForm';
import { useRouter } from 'next/navigation';
import { useSiteSettingStore } from 'src/store/siteSetting';

const mockPush = jest.fn();
const mockCloseSideBarMenu = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  })
}));

jest.mock('src/store/siteSetting', () => ({
  useSiteSettingStore: {
    getState: () => ({
      closeSideBarMenu: mockCloseSideBarMenu
    })
  }
}));

describe('SearchForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search form with input and button', () => {
    render(<SearchForm />);
    expect(screen.getByLabelText('search-input')).toBeInTheDocument();
    expect(screen.getByLabelText('search-button')).toBeInTheDocument();
  });

  it('renders with default search value when provided', () => {
    render(<SearchForm searchValue='test query' />);
    const input = screen.getByLabelText('search-input') as HTMLInputElement;
    expect(input.value).toBe('test query');
  });

  it('submits form and navigates to search page', async () => {
    render(<SearchForm />);
    const input = screen.getByLabelText('search-input') as HTMLInputElement;
    const form = input.closest('form') as HTMLFormElement;

    // Set the input value and trigger change event
    fireEvent.change(input, { target: { value: 'test search', name: 'search' } });
    // Ensure the form has the input registered
    Object.defineProperty(form, 'search', {
      value: input,
      writable: true,
      configurable: true
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/s/test search');
    });
    expect(mockCloseSideBarMenu).toHaveBeenCalled();
  });

  it('does not navigate when search value is empty', () => {
    render(<SearchForm />);
    const input = screen.getByLabelText('search-input') as HTMLInputElement;
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form!);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('trims whitespace from search value before submitting', async () => {
    render(<SearchForm />);
    const input = screen.getByLabelText('search-input') as HTMLInputElement;
    const form = input.closest('form') as HTMLFormElement;

    // Set the input value and trigger change event
    fireEvent.change(input, { target: { value: '  test search  ', name: 'search' } });
    // Ensure the form has the input registered
    Object.defineProperty(form, 'search', {
      value: input,
      writable: true,
      configurable: true
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/s/test search');
    });
  });

  it('applies autoInputHidden class when autoInputHidden is true', () => {
    const { container } = render(<SearchForm autoInputHidden />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('hidden');
  });

  it('focuses input when autoFocus is true and no searchValue', () => {
    render(<SearchForm autoFocus />);
    const input = screen.getByLabelText('search-input') as HTMLInputElement;
    // Focus should be called via useEffect
    expect(input).toBeInTheDocument();
  });

  it('does not focus input when searchValue is provided even with autoFocus', () => {
    render(<SearchForm autoFocus searchValue='test' />);
    const input = screen.getByLabelText('search-input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });
});


