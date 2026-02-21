import React from 'react';
import { render, screen } from '@testing-library/react';
import { List } from '../List';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionZustandContext, initializeNotionStore } from 'src/store/notion';

describe('List Component', () => {
  const mockBulletedBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        {
          plain_text: 'List item',
          type: 'text',
          text: { content: 'List item' },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        }
      ]
    }
  } as NotionBlocksRetrieve;

  const mockNumberedBlock: NotionBlocksRetrieve = {
    id: 'test-id-2',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: [
        {
          plain_text: 'Numbered item',
          type: 'text',
          text: { content: 'Numbered item' },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        }
      ]
    }
  } as NotionBlocksRetrieve;

  const renderWithProvider = (component: React.ReactElement) => {
    const notionStore = initializeNotionStore({
      baseBlock: { results: [] },
      pageInfo: undefined,
      userInfo: undefined
    });
    return render(
      <NotionZustandContext.Provider value={notionStore}>
        {component}
      </NotionZustandContext.Provider>
    );
  };

  it('renders bulleted list item', () => {
    renderWithProvider(<List block={mockBulletedBlock} />);
    expect(screen.getByText('List item')).toBeInTheDocument();
  });

  it('renders numbered list item', () => {
    renderWithProvider(<List block={mockNumberedBlock} />);
    expect(screen.getByText('Numbered item')).toBeInTheDocument();
  });

  it('renders list item with correct structure', () => {
    const { container } = renderWithProvider(<List block={mockBulletedBlock} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
  });
});


