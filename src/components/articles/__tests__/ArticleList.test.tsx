import { render, screen } from '@testing-library/react';

import ArticleList from '../ArticleList';
import type { Article } from 'src/lib/articles';

const mockArticles: Article[] = [
  {
    slug: '2026/first',
    frontmatter: {
      title: 'First Article',
      description: 'First description.',
      pubDatetime: new Date('2026-02-06T10:00:00Z'),
      draft: false,
      featured: false,
      tags: ['TypeScript'],
      author: 'Author',
    },
    content: '# First',
    readingTime: '2 min read',
  },
  {
    slug: '2026/second',
    frontmatter: {
      title: 'Second Article',
      description: 'Second description.',
      pubDatetime: new Date('2026-01-15T10:00:00Z'),
      draft: false,
      featured: true,
      tags: ['React'],
      author: 'Author',
    },
    content: '# Second',
    readingTime: '5 min read',
  },
];

describe('ArticleList', () => {
  it('renders all articles', () => {
    render(<ArticleList articles={mockArticles} />);
    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('shows empty message when no articles', () => {
    render(<ArticleList articles={[]} />);
    expect(screen.getByText('No articles yet.')).toBeInTheDocument();
  });
});
