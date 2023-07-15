import type React from 'react';

type Data = {
  title: string;
  href: string;
  children?: React.ReactNode;
};

export default function LinkToSection({ title, href, children }: Data) {
  return (
    <a
      href={`#${href}`}
      className="block sm:text-lg lg:text-xl max-w-prose leading-relaxed group"
    >
      <span className="dark:group-hover:text-green-custom-highlighted group-hover:text-fuchsia-600 text-fuchsia-500 dark:text-green-custom uppercase font-mono">
        {title}
      </span>
      <br />
      <p className="dark:group-hover:text-slate-300 group-hover:text-slate-800 text-slate-900 dark:text-slate-400">
        {children}
      </p>
    </a>
  );
}
