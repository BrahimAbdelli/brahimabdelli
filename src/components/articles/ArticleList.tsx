import React from 'react';

import type { Article } from 'src/lib/articles';

import ArticleCard from './ArticleCard';

interface ArticleListProps {
  readonly articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }: ArticleListProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
        <p className="text-lg">No articles yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: Article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
