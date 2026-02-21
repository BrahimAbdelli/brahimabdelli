import { render, screen } from '@testing-library/react';
import { HeadingContainer } from '../Heading';
import type { HeadingType } from '../Heading';
import type React from 'react';

describe('HeadingContainer Component', () => {
  it('renders children', () => {
    render(
      <HeadingContainer id='test-id' type='heading_1'>
        Test Heading
      </HeadingContainer>
    );
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('applies heading_1 classes', () => {
    const { container } = render(
      <HeadingContainer id='test-id' type='heading_1'>
        H1 Heading
      </HeadingContainer>
    );
    const section = container.querySelector('section');
    expect(section?.className).toContain('text-[2rem]');
  });

  it('applies heading_2 classes', () => {
    const { container } = render(
      <HeadingContainer id='test-id' type='heading_2'>
        H2 Heading
      </HeadingContainer>
    );
    const section = container.querySelector('section');
    expect(section?.className).toContain('text-[1.5rem]');
  });

  it('applies heading_3 classes', () => {
    const { container } = render(
      <HeadingContainer id='test-id' type='heading_3'>
        H3 Heading
      </HeadingContainer>
    );
    const section = container.querySelector('section');
    expect(section?.className).toContain('text-[1.2rem]');
  });

  it('renders with id attribute', () => {
    const { container } = render(
      <HeadingContainer id='test-heading' type='heading_1'>
        Test
      </HeadingContainer>
    );
    const section = container.querySelector('section');
    expect(section?.id).toBe('test-heading');
  });
});

describe('HeadingInner Component', () => {
  interface HeadingInnerProps {
    type: 'heading_1' | 'heading_2' | 'heading_3';
    id?: string;
    children: React.ReactNode;
  }

  const HeadingInner: React.FC<HeadingInnerProps> = ({ type, id, children }) => {
    const props = {
      className: 'notion-heading-link-copy flex mb-1 font-bold',
      id
    };

    switch (type) {
      case 'heading_1':
        return <h1 {...props}>{children}</h1>;
      case 'heading_2':
        return <h2 {...props}>{children}</h2>;
      case 'heading_3':
        return <h3 {...props}>{children}</h3>;
      default:
        return <div {...props}>{children}</div>;
    }
  };

  it('renders h1 when type is heading_1', () => {
    const { container } = render(
      <HeadingInner type='heading_1' id='test-id'>
        H1 Text
      </HeadingInner>
    );
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toBe('H1 Text');
  });

  it('renders h2 when type is heading_2', () => {
    const { container } = render(
      <HeadingInner type='heading_2' id='test-id'>
        H2 Text
      </HeadingInner>
    );
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('H2 Text');
  });

  it('renders h3 when type is heading_3', () => {
    const { container } = render(
      <HeadingInner type='heading_3' id='test-id'>
        H3 Text
      </HeadingInner>
    );
    const h3 = container.querySelector('h3');
    expect(h3).toBeInTheDocument();
    expect(h3?.textContent).toBe('H3 Text');
  });
});

