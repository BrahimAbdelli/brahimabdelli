import fs from 'fs';
import path from 'path';

import { getAllArticles, getArticleBySlug, getUniqueTags, getArticlesByTag } from '../articles';
import type { Article } from '../articles';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

describe('articles', () => {
  describe('getAllArticles', () => {
    it('returns an array', () => {
      const articles: Article[] = getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it('returns articles sorted by date descending', () => {
      const articles: Article[] = getAllArticles();
      if (articles.length > 1) {
        for (let i = 0; i < articles.length - 1; i++) {
          const current: number = new Date(articles[i]!.frontmatter.pubDatetime).getTime();
          const next: number = new Date(articles[i + 1]!.frontmatter.pubDatetime).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });

    it('does not include draft articles', () => {
      const articles: Article[] = getAllArticles();
      for (const article of articles) {
        expect(article.frontmatter.draft).not.toBe(true);
      }
    });

    it('each article has required fields', () => {
      const articles: Article[] = getAllArticles();
      for (const article of articles) {
        expect(article.slug).toBeTruthy();
        expect(article.frontmatter.title).toBeTruthy();
        expect(article.frontmatter.description).toBeTruthy();
        expect(typeof article.frontmatter.pubDatetime).toBe('string');
        expect(new Date(article.frontmatter.pubDatetime).toISOString()).toBe(article.frontmatter.pubDatetime);
        expect(article.readingTime).toBeTruthy();
      }
    });
  });

  describe('getArticleBySlug', () => {
    it('returns null for non-existent slug', () => {
      const article: Article | null = getArticleBySlug('non-existent-slug-xyz');
      expect(article).toBeNull();
    });

    it('returns the nestier article', () => {
      const article: Article | null = getArticleBySlug('2026/nestier');
      expect(article).not.toBeNull();
      expect(article?.frontmatter.title).toContain('Nestier');
    });
  });

  describe('getUniqueTags', () => {
    it('returns sorted unique tags', () => {
      const articles: Article[] = getAllArticles();
      const tags: string[] = getUniqueTags(articles);
      expect(Array.isArray(tags)).toBe(true);

      const sorted: string[] = [...tags].sort();
      expect(tags).toEqual(sorted);
    });

    it('returns lowercase tags', () => {
      const articles: Article[] = getAllArticles();
      const tags: string[] = getUniqueTags(articles);
      for (const tag of tags) {
        expect(tag).toBe(tag.toLowerCase());
      }
    });
  });

  describe('getArticlesByTag', () => {
    it('filters articles by tag (case-insensitive)', () => {
      const articles: Article[] = getAllArticles();
      const nestjsArticles: Article[] = getArticlesByTag(articles, 'NestJS');
      for (const article of nestjsArticles) {
        const hasTag: boolean = article.frontmatter.tags.some(
          (t: string) => t.toLowerCase() === 'nestjs'
        );
        expect(hasTag).toBe(true);
      }
    });

    it('returns empty array for non-existent tag', () => {
      const articles: Article[] = getAllArticles();
      const result: Article[] = getArticlesByTag(articles, 'nonexistenttag123');
      expect(result).toEqual([]);
    });
  });
});
