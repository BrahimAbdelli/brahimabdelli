import { render, screen } from '@testing-library/react';
import InternshipsList from '../InternshipsList';

describe('InternshipsList Component', () => {
  it('renders internship cards', () => {
    render(<InternshipsList />);
    expect(screen.getByText('Placeholder')).toBeInTheDocument();
    expect(screen.getByText('ESPRIT DSI')).toBeInTheDocument();
  });

  it('renders Placeholder card with link', () => {
    render(<InternshipsList />);
    const links = screen.getAllByRole('link');
    const placeholderLink = links.find(
      (link: HTMLElement) => link.getAttribute('href') === 'https://www.auto-sans-risque.com/'
    );
    expect(placeholderLink).toBeInTheDocument();
  });

  it('renders ESPRIT DSI card with link', () => {
    render(<InternshipsList />);
    const links = screen.getAllByRole('link');
    const espritLink = links.find((link: HTMLElement) => link.getAttribute('href') === 'https://esprit.tn/');
    expect(espritLink).toBeInTheDocument();
  });

  it('renders internship cards with tags', () => {
    render(<InternshipsList />);
    expect(screen.getByText(/NodeJS.*NestJS.*React/i)).toBeInTheDocument();
    expect(screen.getByText('Spring Boot · Angular · MySQL')).toBeInTheDocument();
  });

  it('renders translated internship descriptions', () => {
    render(<InternshipsList />);
    const placeholderElements = screen.getAllByText((content: string, element: Element | null) => {
      const text: string = element?.textContent || '';
      return text.includes('home.internships.placeholder.description');
    });
    expect(placeholderElements.length).toBeGreaterThan(0);
    const espritElements = screen.getAllByText((content: string, element: Element | null) => {
      const text: string = element?.textContent || '';
      return text.includes('home.internships.espritdsi.description1') && 
             text.includes('home.internships.espritdsi.description2');
    });
    expect(espritElements.length).toBeGreaterThan(0);
  });

  it('renders cards in CardGrid', () => {
    const { container } = render(<InternshipsList />);
    const grid: HTMLElement = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});


