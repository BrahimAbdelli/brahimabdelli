import { screen } from '@testing-library/react';
import { Callout } from '../Callout';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { render } from 'src/__tests__/utils/test-utils';

describe('Callout Component', () => {
  const mockBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'callout',
    callout: {
      icon: {
        type: 'emoji',
        emoji: '💡'
      },
      rich_text: [
        {
          plain_text: 'Callout text',
          type: 'text',
          text: { content: 'Callout text' },
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
      color: 'yellow'
    }
  } as NotionBlocksRetrieve;

  it('renders callout with icon', () => {
    render(<Callout block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    expect(screen.getByText('💡')).toBeInTheDocument();
  });

  it('renders callout text', () => {
    render(<Callout block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    expect(screen.getByText('Callout text')).toBeInTheDocument();
  });

  it('renders callout with correct structure', () => {
    const { container } = render(<Callout block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    const callout = container.querySelector('.flex');
    expect(callout).toBeInTheDocument();
  });

  it('renders callout with color', () => {
    const { container } = render(<Callout block={mockBlock} />, {
      notionState: {
        childrensRecord: {},
        baseBlock: { results: [] },
        pageInfo: undefined,
        userInfo: undefined,
        blogProperties: undefined
      }
    });
    const callout = container.querySelector('.flex');
    expect(callout?.className).toBeTruthy();
  });
});


