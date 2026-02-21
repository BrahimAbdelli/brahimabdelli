import { render, screen } from '@testing-library/react';

import CardGrid from '../CardGrid';

describe('CardGrid Component', () => {
  it('renders children correctly', () => {
    render(
      <CardGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </CardGrid>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('applies grid layout classes', () => {
    const { container } = render(
      <CardGrid>
        <div>Child</div>
      </CardGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid?.className).toContain('grid');
    expect(grid?.className).toContain('md:grid-cols-2');
    expect(grid?.className).toContain('xl:grid-cols-3');
  });
});


