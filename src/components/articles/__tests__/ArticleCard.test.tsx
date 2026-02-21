import { render, screen } from '@testing-library/react';

import ArticleCard from '../ArticleCard';
import type { Article } from 'src/lib/articles';

const mockArticle: Article = {
  slug: '2026/test-article',
  frontmatter: {
    title: 'Test Article Title',
    description: 'A test article description.',
    pubDatetime: new Date('2026-02-06T10:00:00Z'),
    draft: false,
    featured: false,
    tags: ['TypeScript', 'Testing'],
    author: 'Test Author',
  },
  content: '# Test content',
  readingTime: '3 min read',
};

describe('ArticleCard', () => {
  it('renders title and description', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('A test article description.')).toBeInTheDocument();
  });

  it('renders reading time', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('3 min read')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('renders featured badge when article is featured', () => {
    const featured: Article = {
      ...mockArticle,
      frontmatter: { ...mockArticle.frontmatter, featured: true },
    };
    render(<ArticleCard article={featured} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('links to the article slug', () => {
    render(<ArticleCard article={mockArticle} />);
    const link: HTMLElement = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles/2026/test-article');
  });
});
