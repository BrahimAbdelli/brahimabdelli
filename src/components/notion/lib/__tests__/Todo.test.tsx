import { render, screen, fireEvent } from '@testing-library/react';
import { Todo } from '../Todo';
import type { NotionBlocksRetrieve } from 'src/types/notion';

describe('Todo Component', () => {
  const mockCheckedBlock: NotionBlocksRetrieve = {
    id: 'test-id',
    type: 'to_do',
    to_do: {
      checked: true,
      rich_text: [
        {
          plain_text: 'Completed task',
          type: 'text',
          text: { content: 'Completed task' },
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

  const mockUncheckedBlock: NotionBlocksRetrieve = {
    id: 'test-id-2',
    type: 'to_do',
    to_do: {
      checked: false,
      rich_text: [
        {
          plain_text: 'Pending task',
          type: 'text',
          text: { content: 'Pending task' },
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

  it('renders checked todo item', () => {
    render(<Todo block={mockCheckedBlock} />);
    expect(screen.getByText('Completed task')).toBeInTheDocument();
  });

  it('renders unchecked todo item', () => {
    render(<Todo block={mockUncheckedBlock} />);
    expect(screen.getByText('Pending task')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    render(<Todo block={mockUncheckedBlock} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('checkbox is checked when todo is checked', () => {
    render(<Todo block={mockCheckedBlock} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('checkbox is unchecked when todo is unchecked', () => {
    render(<Todo block={mockUncheckedBlock} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });
});





