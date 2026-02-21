import { promises as fs } from 'fs';
import path from 'path';

/**
 * Caching folder path is `[project root]/lib/notion/cache`
 *
 * Using the `/tmp` folder in Vercel.
 * project folder will be read only.
 *
 * Vercel uses the `/tmp` folder.
 * The project folder becomes read only.
 */
export const CACHE_PATH: string =
  process.env['VERCEL'] === '1'
    ? path.join('/tmp', 'notion-blog-kit', 'notion', 'cache')
    : path.join(process.cwd(), 'lib', 'notion', 'cache');

function cachePathMaker(blockId: string): string {
  return path.join(CACHE_PATH, `${blockId.replace(/-/g, '')}.json`);
}

export async function get<T>(blockId: string): Promise<T | undefined> {
  try {
    const cachePath: string = cachePathMaker(blockId);
    const content: string = await fs.readFile(cachePath, 'utf-8');
    const parsedData: unknown = JSON.parse(content);

    return parsedData as T;
  } catch {
    return undefined;
  }
}

export async function set(blockId: string, content: any): Promise<boolean> {
  try {
    const cachePath: string = cachePathMaker(blockId);
    try {
      await fs.access(cachePath, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (e: unknown) {
      await fs.mkdir(CACHE_PATH, { recursive: true });
    }

    await fs.writeFile(cachePath, JSON.stringify(content), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

export async function accessCache(blockId: string): Promise<boolean> {
  const cachePath: string = cachePathMaker(blockId);

  try {
    await fs.access(cachePath, (fs.constants || fs).R_OK);
    return true;
  } catch (e: unknown) {
    return false;
  }
}

export async function deleteCache(blockId: string): Promise<boolean> {
  const cachePath: string = cachePathMaker(blockId);

  try {
    await fs.unlink(cachePath);
    return true;
  } catch (e: unknown) {
    return false;
  }
}

export async function deleteCacheDirectory(): Promise<boolean> {
  if (path.resolve(CACHE_PATH) === '/') {
    return false;
  }

  try {
    await fs.rm(CACHE_PATH, { recursive: true, force: true, maxRetries: 1 });
    return true;
  } catch (e: unknown) {
    return false;
  }
}

// exports.expireAll = function () {
//   return fs.rmdirSync(CACHE_PATH, { recursive: true });
// };

// exports.setAllCache = function () {
//   const baseBlock = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
//   const cachePath = cachePathMaker(baseBlock);
//   const notionClient = new Notion.NotionClient();
//   fs.writeFileSync(cachePath, JSON.stringify(content));
// };
