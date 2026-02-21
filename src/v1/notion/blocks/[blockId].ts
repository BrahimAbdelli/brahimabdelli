// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
// @ts-expect-error next-connect types
import nc from 'next-connect';
import { ApiError } from 'lib/Error';
import { Client, LogLevel } from '@notionhq/client';
import { NotionBlocksRetrieve } from 'src/types/notion';

const handler: NextApiHandler = nc<NextApiRequest, NextApiResponse>({
  onError: ApiError.handleError,
  onNoMatch: ApiError.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<NotionBlocksRetrieve>) => {
  const blockId: string | string[] | undefined = req.query?.['blockId'];
  if (typeof blockId !== 'string') {
    throw new TypeError('type error "blockId"');
  }
  const notion: Client = new Client({
    auth: process.env['NOTION_API_SECRET_KEY'] ?? '',
    ...(process.env['DEBUG_LOGS'] ? { logLevel: LogLevel.DEBUG } : {})
  });

  const result: NotionBlocksRetrieve = (await notion.blocks.retrieve({
    block_id: blockId
  })) as NotionBlocksRetrieve;

  res.status(200).json(result);
});

export default handler;
