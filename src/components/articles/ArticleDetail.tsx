'use client';

import React from 'react';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { Article } from 'src/lib/articles';

interface ArticleDetailProps {
  readonly article: Article;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mt-12 mb-6 leading-tight tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-14 mb-5 pb-3 border-b border-slate-200 dark:border-slate-700/60 leading-snug tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4 leading-snug">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-base leading-[1.8] text-slate-600 dark:text-slate-300 mb-5">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-fuchsia-500 hover:text-fuchsia-400 underline underline-offset-2 decoration-fuchsia-500/30 hover:decoration-fuchsia-400 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-slate-800 dark:text-slate-100">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-600 dark:text-slate-300">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-5 ml-1 space-y-2.5 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 ml-1 space-y-2.5 list-decimal list-inside marker:text-slate-400 dark:marker:text-slate-500">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-[1.75] text-slate-600 dark:text-slate-300 pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-fuchsia-400 before:text-sm">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-5 border-l-4 border-fuchsia-400 text-slate-500 dark:text-slate-400 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-') || (props.node?.position && String(children).includes('\n'));
    if (isBlock) {
      return <code className="text-sm font-mono leading-relaxed text-inherit">{children}</code>;
    }
    return (
      <code className="text-sm font-mono text-fuchsia-600 dark:text-fuchsia-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-6 p-5 bg-slate-900 dark:bg-slate-950 text-slate-200 font-mono rounded-xl border border-slate-700/50 overflow-x-auto text-sm leading-relaxed shadow-lg">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-left">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
      {children}
    </td>
  ),
};

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }: ArticleDetailProps) => {
  const date: string = new Date(article.frontmatter.pubDatetime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/articles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-fuchsia-400 transition-colors mb-10 group"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
        Back to articles
      </Link>

      <header className="mb-12 pb-10 border-b border-slate-200 dark:border-slate-700/50">
        {article.frontmatter.featured && (
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-fuchsia-500 mb-3">
            Featured
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 leading-[1.1] tracking-tight">
          {article.frontmatter.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          {article.frontmatter.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400 dark:text-slate-500">
          <time dateTime={article.frontmatter.pubDatetime}>{date}</time>
          <span>&middot;</span>
          <span>{article.readingTime}</span>
          {article.frontmatter.author && (
            <>
              <span>&middot;</span>
              <span>{article.frontmatter.author}</span>
            </>
          )}
        </div>
        {article.frontmatter.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {article.frontmatter.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {article.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700/50">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fuchsia-500 hover:text-fuchsia-400 transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
          Back to all articles
        </Link>
      </footer>
    </article>
  );
};

export default ArticleDetail;
