import { render, screen } from '@testing-library/react';

import Card from '../Card';

describe('Card Component', () => {
  it('renders card with title', () => {
    render(<Card title='Test Card'>Card content</Card>);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders card with highlighted badge when highlighted prop is true', () => {
    render(<Card title='Highlighted Card' highlighted />);
    const badge = screen.getByText((content, element) => {
      return element?.classList.contains('animate-ping') || false;
    });
    expect(badge).toBeInTheDocument();
  });

  it('renders tags when provided', () => {
    const tags = ['React', 'TypeScript', 'Next.js'];
    render(<Card title='Card with Tags' tags={tags} />);
    expect(screen.getByText('React · TypeScript · Next.js')).toBeInTheDocument();
  });

  it('renders as a link when link prop is provided', () => {
    render(
      <Card title='Linked Card' link='https://example.com'>
        Card with link
      </Card>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders as internal link when link starts with /', () => {
    render(
      <Card title='Internal Link' link='/articles'>
        Internal link card
      </Card>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles');
  });

  it('renders as div when no link is provided', () => {
    const { container } = render(<Card title='Static Card'>Static content</Card>);
    const card = container.querySelector('div');
    expect(card).toBeInTheDocument();
    expect(card?.className).toContain('flex');
  });
});


