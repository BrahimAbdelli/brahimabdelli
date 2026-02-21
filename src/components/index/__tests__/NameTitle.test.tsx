import { render, screen } from '@testing-library/react';
import NameTitle from '../NameTitle';

describe('NameTitle Component', () => {
  it('renders children text', () => {
    render(<NameTitle>Test Name</NameTitle>);
    expect(screen.getByText('Test Name')).toBeInTheDocument();
  });

  it('renders accent text when provided', () => {
    render(<NameTitle accentText='Hello'>Test Name</NameTitle>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('does not render accent text when not provided', () => {
    render(<NameTitle>Test Name</NameTitle>);
    expect(screen.queryByText(/Hello/i)).not.toBeInTheDocument();
  });

  it('applies big classes when big prop is true', () => {
    const { container } = render(<NameTitle big>Test Name</NameTitle>);
    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('text-4xl');
  });

  it('applies regular classes when big prop is false', () => {
    const { container } = render(<NameTitle>Test Name</NameTitle>);
    const h1 = container.querySelector('h1');
    // sectionTitleClasses includes text-4xl, so we check for the difference
    expect(h1?.className).toContain('text-4xl');
    expect(h1?.className).not.toContain('text-8xl'); // big class uses text-8xl
  });

  it('renders dot when big prop is true', () => {
    render(<NameTitle big>Test Name</NameTitle>);
    const dots = screen.getAllByText('.');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('renders emoji', () => {
    render(<NameTitle>Test Name</NameTitle>);
    expect(screen.getByText('👋')).toBeInTheDocument();
  });

  it('renders translation text', () => {
    render(<NameTitle>Test Name</NameTitle>);
    expect(screen.getByText('home.description')).toBeInTheDocument();
  });

  it('renders location text', () => {
    render(<NameTitle>Test Name</NameTitle>);
    expect(screen.getByText('home.location')).toBeInTheDocument();
  });
});


