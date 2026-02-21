import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
// @ts-expect-error next-connect types
import nc from 'next-connect';
import { ApiError } from 'lib/Error';
import { Client, LogLevel } from '@notionhq/client';
import { NotionPagesRetrieve } from 'src/types/notion';

const handler: NextApiHandler = nc<NextApiRequest, NextApiResponse>({
  onError: ApiError.handleError,
  onNoMatch: ApiError.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<NotionPagesRetrieve>) => {
  const pageId: string | string[] | undefined = req.query?.['pageId'];
  if (typeof pageId !== 'string') {
    throw new TypeError('type error "pageId"');
  }
  const notion: Client = new Client({
    auth: process.env['NOTION_API_SECRET_KEY'] ?? '',
    ...(process.env['DEBUG_LOGS'] ? { logLevel: LogLevel.DEBUG } : {})
  });

  const result: NotionPagesRetrieve = (await notion.pages.retrieve({
    page_id: pageId
  })) as NotionPagesRetrieve;

  res.status(200).json(result);
});

export default handler;
