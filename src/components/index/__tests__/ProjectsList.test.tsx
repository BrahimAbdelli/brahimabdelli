import { render, screen } from '@testing-library/react';
import ProjectsList from '../ProjectsList';

describe('ProjectsList Component', () => {
  it('renders project cards', () => {
    render(<ProjectsList />);
    expect(screen.getByText('Nestier')).toBeInTheDocument();
    expect(screen.getByText('Personal Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Auto Sans Risque')).toBeInTheDocument();
  });

  it('renders Nestier card with link', () => {
    render(<ProjectsList />);
    const links = screen.getAllByRole('link');
    const nestjsLink = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/BrahimAbdelli/nestjs-boilerplate'
    );
    expect(nestjsLink).toBeInTheDocument();
  });

  it('renders Personal Portfolio card with link', () => {
    render(<ProjectsList />);
    const links = screen.getAllByRole('link');
    const portfolioLink = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/BrahimAbdelli/brahimabdelli'
    );
    expect(portfolioLink).toBeInTheDocument();
  });

  it('renders project cards with tags', () => {
    render(<ProjectsList />);
    expect(screen.getByText(/NestJS.*MongoDB.*TypeORM.*Typescript/)).toBeInTheDocument();
    expect(screen.getByText('NextJS, TailwindCSS, Typescript')).toBeInTheDocument();
  });

  it('renders cards in CardGrid', () => {
    const { container } = render(<ProjectsList />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders translated project descriptions', () => {
    render(<ProjectsList />);
    expect(screen.getByText('home.projects.portfolio.description')).toBeInTheDocument();
  });
});





