import { render } from '@testing-library/react';

import { NotionSeo } from '../NotionSeo';
import type { GetNotionBlock } from 'src/types/notion';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='head'>{children}</div>
}));

describe('NotionSeo Component', () => {
  const mockPageInfo: GetNotionBlock['pageInfo'] = {
    id: 'test-id',
    object: 'page',
    properties: {},
    parent: { database_id: 'parent-db-id' },
    cover: undefined,
    icon: undefined
  } as any;

  const getHead = (container: HTMLElement): HTMLElement | null =>
    container.querySelector('[data-testid="head"]');

  it('renders title in Head', () => {
    render(<NotionSeo page={mockPageInfo} title='Test Page' description={null} />);
    expect(document.title).toBe('Test Page');
  });

  it('renders Untitled when title is null', () => {
    render(<NotionSeo page={mockPageInfo} title={null} description={null} />);
    expect(document.title).toBe('Untitled');
  });

  it('truncates title to max length', () => {
    const longTitle: string = 'A'.repeat(200);
    const { container } = render(<NotionSeo page={mockPageInfo} title={longTitle} description={null} />);
    const text: string = getHead(container)?.textContent ?? '';
    expect(text.length).toBeLessThanOrEqual(100);
  });

  it('renders Head element', () => {
    const { container } = render(<NotionSeo page={mockPageInfo} title='Test' description='Test' />);
    expect(getHead(container)).toBeTruthy();
  });

  it('renders without cover', () => {
    const { container } = render(<NotionSeo page={mockPageInfo} title='Test' description={null} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with description', () => {
    const { container } = render(
      <NotionSeo page={mockPageInfo} title='Test' description='A description' />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with cover', () => {
    const pageWithCover: GetNotionBlock['pageInfo'] = {
      ...mockPageInfo,
      cover: {
        type: 'external',
        external: { url: 'https://example.com/cover.jpg' }
      }
    } as any;
    const { container } = render(<NotionSeo page={pageWithCover} title='Test' description='Test' />);
    expect(container.firstChild).toBeTruthy();
  });
});
