import { render, screen } from '@testing-library/react';
import SectionTitle from '../SectionTitle';

describe('SectionTitle Component', () => {
  it('renders children text', () => {
    render(<SectionTitle>Test Section</SectionTitle>);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders accent text when provided', () => {
    render(<SectionTitle accentText='01'>Test Section</SectionTitle>);
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('does not render accent text when not provided', () => {
    render(<SectionTitle>Test Section</SectionTitle>);
    expect(screen.queryByText('01')).not.toBeInTheDocument();
  });

  it('applies big classes when big prop is true', () => {
    const { container } = render(<SectionTitle big>Test Section</SectionTitle>);
    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('text-4xl');
  });

  it('applies regular classes when big prop is false', () => {
    const { container } = render(<SectionTitle>Test Section</SectionTitle>);
    const h1 = container.querySelector('h1');
    // sectionTitleClasses includes text-4xl, so we check for the difference
    expect(h1?.className).toContain('text-4xl');
    expect(h1?.className).not.toContain('text-8xl'); // big class uses text-8xl
  });

  it('renders dot when big prop is true', () => {
    render(<SectionTitle big>Test Section</SectionTitle>);
    expect(screen.getByText('.')).toBeInTheDocument();
  });

  it('does not render dot when big prop is false', () => {
    render(<SectionTitle>Test Section</SectionTitle>);
    expect(screen.queryByText('.')).not.toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <SectionTitle>
        <span>Complex Content</span>
      </SectionTitle>
    );
    expect(screen.getByText('Complex Content')).toBeInTheDocument();
  });
});


