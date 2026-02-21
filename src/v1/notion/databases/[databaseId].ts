// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
// @ts-expect-error next-connect types
import nc from 'next-connect';
import { ApiError } from 'lib/Error';
import { Client, LogLevel } from '@notionhq/client';
import { NotionDatabasesRetrieve } from 'src/types/notion';

const handler: NextApiHandler = nc<NextApiRequest, NextApiResponse>({
  onError: ApiError.handleError,
  onNoMatch: ApiError.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<NotionDatabasesRetrieve>) => {
  const databaseId: string | string[] | undefined = req.query?.['databaseId'];
  if (typeof databaseId !== 'string') {
    throw new TypeError('type error "databaseId"');
  }
  const notion: Client = new Client({
    auth: process.env['NOTION_API_SECRET_KEY'] ?? '',
    ...(process.env['DEBUG_LOGS'] ? { logLevel: LogLevel.DEBUG } : {})
  });

  const result: NotionDatabasesRetrieve = (await notion.databases.retrieve({
    database_id: databaseId
  })) as NotionDatabasesRetrieve;

  res.status(200).json(result);
});

export default handler;
