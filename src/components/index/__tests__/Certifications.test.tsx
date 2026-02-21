import { render, screen } from '@testing-library/react';
import Certifications from '../Certifications';

describe('Certifications Component', () => {
  it('renders certification card', () => {
    render(<Certifications />);
    expect(
      screen.getByText('home.certifications.ckad.name')
    ).toBeInTheDocument();
  });

  it('renders certification with link', () => {
    render(<Certifications />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      'https://www.credly.com/badges/8b07b358-af2b-49cb-97e6-ab1b7f8adce6'
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders certification with highlighted badge', () => {
    render(<Certifications />);
    const card = screen.getByText('home.certifications.ckad.name');
    expect(card).toBeInTheDocument();
  });

  it('renders certification tags', () => {
    render(<Certifications />);
    expect(screen.getByText('home.certifications.ckad.tags')).toBeInTheDocument();
  });

  it('renders cards in CardGrid', () => {
    const { container } = render(<Certifications />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});





