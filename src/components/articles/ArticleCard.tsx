import React from 'react';

import Link from 'next/link';

import type { Article } from 'src/lib/articles';

interface ArticleCardProps {
  readonly article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }: ArticleCardProps) => {
  const date: string = new Date(article.frontmatter.pubDatetime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <article className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition hover:shadow-lg hover:border-fuchsia-400 dark:hover:border-fuchsia-500 bg-white dark:bg-slate-900">
        {article.frontmatter.featured && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-fuchsia-500 mb-2">
            Featured
          </span>
        )}
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-fuchsia-500 transition-colors">
          {article.frontmatter.title}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 line-clamp-2">
          {article.frontmatter.description}
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <time dateTime={article.frontmatter.pubDatetime}>{date}</time>
          <span>&middot;</span>
          <span>{article.readingTime}</span>
        </div>
        {article.frontmatter.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.frontmatter.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
};

export default ArticleCard;
