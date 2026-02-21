import { render, screen, fireEvent } from '@testing-library/react';
import { CopyButtonWrapper } from '../CopyButtonWrapper';
import { copyTextAtClipBoard } from '../../../lib/utils';

jest.mock('../../../lib/utils');

const mockCopyTextAtClipBoard = copyTextAtClipBoard as jest.MockedFunction<typeof copyTextAtClipBoard>;

describe('CopyButtonWrapper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });
  });

  it('renders children', () => {
    render(
      <CopyButtonWrapper content='test'>
        <div>Test Content</div>
      </CopyButtonWrapper>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders copy button', () => {
    const { container } = render(
      <CopyButtonWrapper content='test'>
        <div>Test Content</div>
      </CopyButtonWrapper>
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('copies content to clipboard when button is clicked', () => {
    const { container } = render(
      <CopyButtonWrapper content='test content'>
        <div>Test Content</div>
      </CopyButtonWrapper>
    );
    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(mockCopyTextAtClipBoard).toHaveBeenCalledWith('test content');
  });

  it('does not copy when content is not provided', () => {
    const { container } = render(
      <CopyButtonWrapper>
        <div>Test Content</div>
      </CopyButtonWrapper>
    );
    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(mockCopyTextAtClipBoard).not.toHaveBeenCalled();
  });

  it('shows button on hover', () => {
    const { container } = render(
      <CopyButtonWrapper content='test'>
        <div className='group'>Test Content</div>
      </CopyButtonWrapper>
    );
    const wrapper = container.querySelector('.group');
    const button = container.querySelector('button');
    expect(button?.className).toContain('invisible');
    expect(button?.className).toContain('group-hover:visible');
  });
});





