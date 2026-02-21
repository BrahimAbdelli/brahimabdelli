import type React from 'react';

import Link, { LinkProps } from 'next/link';

export const OptionalNextLink: React.FC<
  LinkProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      wrappingAnchor: boolean;
      children: React.JSX.Element;
    }
> = ({ wrappingAnchor, children, ...props }) => {
  if (wrappingAnchor) {
    return <Link {...props}>{children}</Link>;
  }
  const { scroll: _scroll, shallow: _shallow, prefetch: _prefetch, as: _as, replace: _replace, passHref: _passHref, ...spanProps }: typeof props = props;
  return <span {...spanProps}>{children}</span>;
};
