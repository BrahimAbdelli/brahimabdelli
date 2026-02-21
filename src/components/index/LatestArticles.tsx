import type React from 'react';

import Link from 'next/link';

import type { Article } from 'src/lib/articles';

interface LatestArticlesProps {
  readonly articles: Article[];
}

function ArticlePreviewCard({ article }: { readonly article: Article }): React.JSX.Element {
  const date: string = new Date(article.frontmatter.pubDatetime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="relative h-full rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 p-6 sm:p-8 transition-all duration-300 hover:border-fuchsia-400/60 dark:hover:border-green-custom/60 hover:shadow-xl hover:shadow-fuchsia-500/5 dark:hover:shadow-green-custom/5">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 dark:text-slate-500 mb-4">
          <time dateTime={article.frontmatter.pubDatetime}>{date}</time>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>{article.readingTime}</span>
          {article.frontmatter.featured && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-fuchsia-500 dark:text-green-custom font-semibold uppercase tracking-wider">Featured</span>
            </>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-fuchsia-500 dark:group-hover:text-green-custom transition-colors">
          {article.frontmatter.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-5">
          {article.frontmatter.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {article.frontmatter.tags.slice(0, 4).map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
          {article.frontmatter.tags.length > 4 && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500">
              +{article.frontmatter.tags.length - 4}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-fuchsia-500 dark:text-green-custom opacity-0 group-hover:opacity-100 transition-opacity">
          Read article
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </div>
      </article>
    </Link>
  );
}

export default function LatestArticles({ articles }: LatestArticlesProps): React.JSX.Element | null {
  if (articles.length === 0) return null;

  return (
    <div>
      <div className={`grid gap-6 ${articles.length === 1 ? 'max-w-2xl' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
        {articles.map((article: Article) => (
          <ArticlePreviewCard key={article.slug} article={article} />
        ))}
      </div>
      <div className="mt-8 sm:mt-10">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors group"
        >
          View all articles
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
