import { render, screen } from '@testing-library/react';
import LinkToSection from '../LinkToSection';

describe('LinkToSection Component', () => {
  it('renders title and children', () => {
    render(
      <LinkToSection title='About' href='about'>
        About me content
      </LinkToSection>
    );
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('About me content')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    render(
      <LinkToSection title='Projects' href='projects'>
        Projects content
      </LinkToSection>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#projects');
  });

  it('applies correct classes to link', () => {
    const { container } = render(
      <LinkToSection title='Test' href='test'>
        Test content
      </LinkToSection>
    );
    const link = container.querySelector('a');
    expect(link?.className).toContain('block');
    expect(link?.className).toContain('group');
  });

  it('renders without children', () => {
    render(<LinkToSection title='Test' href='test' />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <LinkToSection title='Complex' href='complex'>
        <span>Complex content</span>
        <br />
        <span>More content</span>
      </LinkToSection>
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
  });
});





