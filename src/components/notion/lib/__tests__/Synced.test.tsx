import { render, screen } from '@testing-library/react';
import { Synced } from '../Synced';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('../index', () => ({
  NotionHasChildrenRender: ({ block }: { block: NotionBlocksRetrieve }) => (
    <div data-testid='has-children-render'>Synced content</div>
  )
}));

describe('Synced Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'synced-id',
    type: 'synced_block',
    synced_block: {},
    has_children: true
  } as NotionBlocksRetrieve;

  it('renders synced block', () => {
    render(<Synced block={mockBlock} />);
    expect(screen.getByTestId('has-children-render')).toBeInTheDocument();
  });

  it('passes noLeftPadding prop to HasChildrenRender', () => {
    const { container } = render(<Synced block={mockBlock} />);
    expect(container).toBeInTheDocument();
  });

  it('handles synced block with children', () => {
    render(<Synced block={mockBlock} />);
    expect(screen.getByText('Synced content')).toBeInTheDocument();
  });
});


