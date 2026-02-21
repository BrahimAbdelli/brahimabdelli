import { render, screen } from '@testing-library/react';
import { OptionalNextLink } from '../OptionalNextLink';

describe('OptionalNextLink Component', () => {
  it('renders as Link when wrappingAnchor is true', () => {
    render(
      <OptionalNextLink href='/test' wrappingAnchor>
        <a>Link Content</a>
      </OptionalNextLink>
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders as span when wrappingAnchor is false', () => {
    const { container } = render(
      <OptionalNextLink href='/test' wrappingAnchor={false}>
        <a>Span Content</a>
      </OptionalNextLink>
    );
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('passes props to Link when wrappingAnchor is true', () => {
    render(
      <OptionalNextLink href='/test' className='test-class' wrappingAnchor>
        <a>Test Link</a>
      </OptionalNextLink>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('passes non-Link props to span when wrappingAnchor is false', () => {
    const { container } = render(
      <OptionalNextLink href='/test' className='test-class' wrappingAnchor={false}>
        <a>Test Span</a>
      </OptionalNextLink>
    );
    const span = container.querySelector('span');
    expect(span?.className).toContain('test-class');
  });
});





