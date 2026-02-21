import { render, screen } from '@testing-library/react';
import Activities from '../Activities';

describe('Activities Component', () => {
  it('renders activities cards', () => {
    render(<Activities />);
    expect(screen.getByText('home.activities.music.name')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getAllByText('home.activities.travel.name').length).toBeGreaterThan(0);
  });

  it('renders music activity card with description', () => {
    render(<Activities />);
    const descriptionElements = screen.getAllByText((content, element) => {
      const text = element?.textContent || '';
      return text.includes('home.activities.music.description1') && 
             text.includes('home.activities.music.description2');
    });
    expect(descriptionElements.length).toBeGreaterThan(0);
  });

  it('renders reading activity card', () => {
    render(<Activities />);
    expect(screen.getByText('home.activities.reading.description')).toBeInTheDocument();
  });

  it('renders travel activity card', () => {
    render(<Activities />);
    expect(screen.getByText('home.activities.travel.description')).toBeInTheDocument();
  });

  it('renders cards in CardGrid', () => {
    const { container } = render(<Activities />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});


