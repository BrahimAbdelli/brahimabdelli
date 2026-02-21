import { render, screen } from '@testing-library/react';
import { HasChildrenRender } from '../HasChildrenRender';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';

jest.mock('src/store/notion');
jest.mock('../index', () => ({
  NotionBlocksRender: ({ blocks }: { blocks: NotionBlocksRetrieve[] }) => (
    <div>{blocks.length} child blocks</div>
  )
}));

const mockUseNotionStore = useNotionStore as jest.MockedFunction<typeof useNotionStore>;

describe('HasChildrenRender Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'paragraph',
    has_children: true,
    paragraph: {
      rich_text: []
    }
  } as NotionBlocksRetrieve;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {
        'test-id': {
          results: [
            {
              id: 'child-1',
              type: 'paragraph',
              paragraph: { rich_text: [] }
            }
          ]
        }
      }
    } as any);
  });

  it('renders children when provided', () => {
    render(
      <HasChildrenRender block={mockBlock}>
        <div>Test Child</div>
      </HasChildrenRender>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders child blocks when has_children is true', () => {
    render(<HasChildrenRender block={mockBlock} />);
    expect(screen.getByText('1 child blocks')).toBeInTheDocument();
  });

  it('does not render child blocks when has_children is false', () => {
    const blockWithoutChildren: NotionBlocksRetrieve = {
      ...mockBlock,
      has_children: false
    };
    render(<HasChildrenRender block={blockWithoutChildren} />);
    expect(screen.queryByText(/child blocks/i)).not.toBeInTheDocument();
  });

  it('applies noLeftPadding class when noLeftPadding is true', () => {
    const { container } = render(<HasChildrenRender block={mockBlock} noLeftPadding />);
    const div = container.querySelector('div');
    expect(div?.className).not.toContain('pl-6');
  });

  it('applies left padding when noLeftPadding is false', () => {
    const { container } = render(<HasChildrenRender block={mockBlock} noLeftPadding={false} />);
    const div = container.querySelector('div.pl-6');
    expect(div).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <HasChildrenRender block={mockBlock} className='custom-class' />
    );
    const div = container.querySelector('div.custom-class');
    expect(div).toBeInTheDocument();
  });

  it('handles empty children record gracefully', () => {
    mockUseNotionStore.mockReturnValue({
      childrensRecord: {}
    } as any);
    render(<HasChildrenRender block={mockBlock} />);
    expect(screen.getByText('0 child blocks')).toBeInTheDocument();
  });
});





