import axios from 'axios';
import useSWR, { SWRResponse } from 'swr';

import { siteConfig } from 'site-config';
import {
  FileObject,
  IconObject,
  NotionBlocksRetrieve,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve,
  RichText
} from 'src/types/notion';

export type NotionImageFetcherParams = {
  blockId: string;
  blockType: 'page' | 'database' | 'video' | 'image' | 'callout' | 'file';
  useType: 'image' | 'video' | 'cover' | 'icon' | 'file';
  initialFileObject?: FileObject;
  autoRefresh?: boolean;
  refreshInterval?: number;
};

export function isExpired({ expiry_time, url }: NonNullable<FileObject['file']>): boolean {
  const now: number = Date.now();
  if (url && expiry_time && new Date(expiry_time).getTime() < now) {
    return true;
  }
  return false;
}

export const useRenewExpiredFile: (params: NotionImageFetcherParams) => SWRResponse<FileObject & IconObject> = ({
  blockId,
  blockType,
  useType,
  initialFileObject,
  autoRefresh = true,
  refreshInterval = 5 * 60 * 1000
}: NotionImageFetcherParams) => {
  return useSWR(
    `${siteConfig.path}/notion/${blockType}/${blockId}?useType=${useType}`,
    async () => {
      try {
        if (initialFileObject?.external?.url) {
          return initialFileObject;
        }
        if (
          initialFileObject?.file?.url &&
          initialFileObject?.file?.expiry_time &&
          !isExpired(initialFileObject.file)
        ) {
          return initialFileObject;
        }

        switch (blockType) {
          case 'database':
          case 'page': {
            if (useType !== 'cover' && useType !== 'icon') {
              const error: Error = new Error('not support use type');
              throw error;
            }
            const page: NotionDatabasesRetrieve | NotionPagesRetrieve = await axios
              .get<NotionDatabasesRetrieve | NotionPagesRetrieve>(
                `${siteConfig.path}/notion/${blockType}s/${blockId}`
              )
              .then((res) => res?.data);

            if (!page[useType]) {
              const error: Error = new Error('not support use type');
              throw error;
            }
            return page[useType];
          }
          case 'file':
          case 'video':
          case 'callout':
          case 'image': {
            if (useType !== 'image' && useType !== 'video' && useType !== 'icon') {
              const error: Error = new Error('not support use type');
              throw error;
            }
            const block: NotionBlocksRetrieve = await axios
              .get<NotionBlocksRetrieve>(`${siteConfig.path}/notion/blocks/${blockId}`)
              .then((res) => res?.data);

            if (blockType === 'callout') {
              return block.callout.icon;
            }
            return block?.[blockType];
          }
        }
      } catch (e: unknown) {
        if (blockType === 'video') {
          throw e;
        }

        return {
          type: 'file',
          file: {
            url: null,
            expiry_time: ''
          }
        };
      }
    },
    {
      errorRetryCount: 1,
      ...(initialFileObject ? { fallbackData: initialFileObject } : {}),
      revalidateOnFocus: false,
      ...(autoRefresh ? { refreshInterval } : {})
    }
  ) as SWRResponse<FileObject & IconObject>;
};

export function richTextToPlainText(richText?: Array<RichText>): string {
  if (!Array.isArray(richText)) {
    return '';
  }
  return richText?.map((text: RichText): string => text.plain_text.trim()).join('') || '';
}
