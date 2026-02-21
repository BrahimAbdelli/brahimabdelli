import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';

const ARTICLES_DIR: string = path.join(process.cwd(), 'content', 'articles');

export const ArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDatetime: z.coerce.date().transform((d: Date) => d.toISOString()),
  modDatetime: z.coerce
    .date()
    .transform((d: Date) => d.toISOString())
    .optional()
    .nullable(),
  draft: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  heroImage: z.string().optional(),
  author: z.string().default('Brahim Abdelli'),
});

export type ArticleFrontmatter = z.infer<typeof ArticleSchema>;

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: string;
}

function getArticleFiles(dir: string = ARTICLES_DIR): Array<{ filepath: string; slug: string }> {
  const results: Array<{ filepath: string; slug: string }> = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries: fs.Dirent[] = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath: string = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested: Array<{ filepath: string; slug: string }> = getArticleFiles(fullPath);
      results.push(...nested);
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      const relativePath: string = path.relative(ARTICLES_DIR, fullPath);
      const slug: string = relativePath
        .replaceAll('\\', '/')
        .replace(/\.(md|mdx)$/, '');
      results.push({ filepath: fullPath, slug });
    }
  }

  return results;
}

function parseArticle(filepath: string, slug: string): Article | null {
  const raw: string = fs.readFileSync(filepath, 'utf-8');
  const { data, content }: matter.GrayMatterFile<string> = matter(raw);

  const parsed: z.SafeParseReturnType<unknown, ArticleFrontmatter> = ArticleSchema.safeParse(data);
  if (!parsed.success) {
    return null;
  }

  const stats: readingTime.ReadTimeResults = readingTime(content);

  return {
    slug,
    frontmatter: parsed.data,
    content,
    readingTime: `${Math.ceil(stats.minutes)} min read`,
  };
}

export function getAllArticles(): Article[] {
  const files: Array<{ filepath: string; slug: string }> = getArticleFiles();
  const articles: Article[] = [];

  for (const file of files) {
    const article: Article | null = parseArticle(file.filepath, file.slug);
    if (article !== null && !article.frontmatter.draft) {
      articles.push(article);
    }
  }

  return articles.sort(
    (a: Article, b: Article) =>
      new Date(b.frontmatter.pubDatetime).getTime() -
      new Date(a.frontmatter.pubDatetime).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | null {
  const files: Array<{ filepath: string; slug: string }> = getArticleFiles();
  const match: { filepath: string; slug: string } | undefined = files.find(
    (f: { filepath: string; slug: string }) => f.slug === slug
  );

  if (!match) {
    return null;
  }

  return parseArticle(match.filepath, match.slug);
}

export function getUniqueTags(articles: Article[]): string[] {
  const tagSet: Set<string> = new Set<string>();
  for (const article of articles) {
    for (const tag of article.frontmatter.tags) {
      tagSet.add(tag.toLowerCase());
    }
  }
  return Array.from(tagSet).sort((a: string, b: string) => a.localeCompare(b));
}

export function getArticlesByTag(articles: Article[], tag: string): Article[] {
  const normalizedTag: string = tag.toLowerCase();
  return articles.filter((article: Article) =>
    article.frontmatter.tags.some((t: string) => t.toLowerCase() === normalizedTag)
  );
}
