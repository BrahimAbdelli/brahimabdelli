import type React from 'react';
import type { ReactNode } from 'react';

import classnames from 'classnames';
import { useRouter } from 'next/router';

import { copyTextAtClipBoard } from 'src/lib/utils';
import type { NotionBlocksRetrieve } from 'src/types/notion';

import { NotionHasChildrenRender, NotionParagraphBlock } from '.';
import { richTextToPlainText } from './utils';

export type HeadingType = 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
export interface HeadingContainerProps {
  id?: string;
  type?: HeadingType;
  children: ReactNode;
}
export const HeadingContainer: React.FC<HeadingContainerProps> = ({ id, type, children }) => {
  return (
    <section
      id={id}
      className={classnames(
        'pt-[1.2em]',
        type === 'heading_1'
          ? 'text-[2rem]'
          : type === 'heading_2' || type === 'child_database'
          ? 'text-[1.5rem]'
          : type === 'normal'
          ? undefined
          : 'text-[1.2rem]'
      )}
    >
      {children}
    </section>
  );
};

export const HeadingInner: React.FC<HeadingInnerProps> = ({ type, children }) => {
  const props: { className: string } = {
    className: 'notion-heading-link-copy flex mb-1 font-bold'
  };

  switch (type) {
    case 'heading_1': {
      return <h1 {...props}>{children}</h1>;
    }
    case 'heading_2': {
      return <h2 {...props}>{children}</h2>;
    }
    case 'heading_3': {
      return <h3 {...props}>{children}</h3>;
    }
    case 'child_database':
    case 'normal':
    default: {
      return <div {...props}>{children}</div>;
    }
  }
};
export interface HeadingInnerProps {
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
  children: ReactNode;
}

export const CopyHeadingLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  const handleClick: (url: string) => () => void = (url: string) => () => {
    const { href }: URL = new URL(location.origin + url);

    href && copyTextAtClipBoard(href);
  };
  return (
    <span className='heading-link' onClick={handleClick(href)}>
      {children}
    </span>
  );
};

interface HeadingProps {
  block: NotionBlocksRetrieve;
}

export const Heading: React.FC<HeadingProps> = ({ block }): React.JSX.Element => {
  const router: ReturnType<typeof useRouter> = useRouter();
  const headingType: 'heading_1' | 'heading_2' | 'heading_3' = block.type as
    | 'heading_1'
    | 'heading_2'
    | 'heading_3';
  const isToggleableHeading: boolean = block.has_children;

  const currentPath: string = router.asPath.replace(/#.*$/, '');
  const headingHash: string = richTextToPlainText(block[headingType].rich_text);
  const headingHref: string = `${currentPath}#${encodeURIComponent(headingHash)}`;

  const headingContent: React.ReactElement = (
    <NotionParagraphBlock
      blockId={block.id}
      richText={block[headingType].rich_text}
      color={block[headingType].color}
      headingLink={headingHref}
    />
  );

  if (isToggleableHeading) {
    return (
      <HeadingContainer id={headingHash} type={headingType}>
        <details>
          <summary className='cursor-pointer [&>*]:inline [&>*>*]:inline'>
            <HeadingInner type={headingType}>{headingContent}</HeadingInner>
          </summary>
          <div className='pl-[0.9em]'>
            <div className='text-base'>
              <NotionHasChildrenRender block={block} noLeftPadding />
            </div>
          </div>
        </details>
      </HeadingContainer>
    );
  }

  return (
    <HeadingContainer id={headingHash} type={headingType}>
      <HeadingInner type={headingType}>{headingContent}</HeadingInner>
    </HeadingContainer>
  );
};
