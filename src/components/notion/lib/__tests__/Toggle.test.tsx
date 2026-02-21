import { screen } from '@testing-library/react';
import { Toggle } from '../Toggle';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { render } from 'src/__tests__/utils/test-utils';

describe('Toggle Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'toggle',
    toggle: {
      rich_text: [
        {
          plain_text: 'Toggle title',
          type: 'text',
          text: { content: 'Toggle title' },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        }
      ],
      color: 'default'
    }
  } as NotionBlocksRetrieve;

  it('renders toggle title', () => {
    render(<Toggle block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    expect(screen.getByText('Toggle title')).toBeInTheDocument();
  });

  it('renders toggle with correct structure', () => {
    const { container } = render(<Toggle block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    const toggle = container.querySelector('details');
    expect(toggle).toBeInTheDocument();
  });

  it('renders summary element', () => {
    const { container } = render(<Toggle block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    const summary = container.querySelector('summary');
    expect(summary).toBeInTheDocument();
  });
});


