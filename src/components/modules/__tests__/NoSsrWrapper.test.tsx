import { render, screen } from '@testing-library/react';
import NoSsrWrapper from '../NoSsrWrapper';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const React = require('react');
    const { Fragment } = React;
    return ({ children }: { children: React.ReactNode }) => <Fragment>{children}</Fragment>;
  }
}));

describe('NoSsrWrapper Component', () => {
  it('renders children', () => {
    render(
      <NoSsrWrapper>
        <div>Test Content</div>
      </NoSsrWrapper>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <NoSsrWrapper>
        <div>Child 1</div>
        <div>Child 2</div>
      </NoSsrWrapper>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <NoSsrWrapper>
        <div>
          <span>Nested Content</span>
        </div>
      </NoSsrWrapper>
    );
    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });
});


