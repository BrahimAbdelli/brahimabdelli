import type React from 'react';

import { useEffect, useRef } from 'react';

import { AWS_SECURE_NOTION_STATIC, PROXY_SECURE_NOTION_STATIC } from 'src/lib/notion';
import type { FileObject, IconObject, NotionBlocksRetrieve } from 'src/types/notion';

import { useRenewExpiredFile } from './utils';
import { NotionParagraphBlock } from './index';

interface FileProps {
  block: NotionBlocksRetrieve;
}

export const File: React.FC<FileProps> = ({ block }): React.JSX.Element | null => {
  const cachedFileObject: React.MutableRefObject<FileObject> = useRef<FileObject>(block.file);

  const refreshMs: number | undefined = cachedFileObject.current.file?.expiry_time
    ? new Date(cachedFileObject.current.file?.expiry_time).getTime() -
        Date.now() -
        60 * 5 * 1000 || 60 * 5 * 1000
    : undefined;

  const { data: file }: { data: (FileObject & IconObject) | undefined } = useRenewExpiredFile({
    blockId: block.id,
    blockType: 'file',
    useType: 'file',
    initialFileObject: cachedFileObject.current,
    autoRefresh: true,
    ...(refreshMs !== undefined ? { refreshInterval: refreshMs } : {})
  });

  const fileType: string | undefined = file?.type;
  const fileUrl: string | undefined = file?.file?.url || file?.external?.url;
  const filename: string | null =
    fileType === 'file'
      ? file?.file?.url?.match(/(notion-static.com\/[-0-9a-z]+\/)(.+)(\?)/)?.[2] || null
      : null;

  const proxyFileUrl: string | null =
    fileUrl && fileUrl?.includes(AWS_SECURE_NOTION_STATIC)
      ? fileUrl.replace(AWS_SECURE_NOTION_STATIC, PROXY_SECURE_NOTION_STATIC)
      : null;

  useEffect(() => {
    if (file) cachedFileObject.current = file;
  }, [file]);

  if (!fileUrl) {
    return null;
  }

  return (
    <div>
      <a
        href={proxyFileUrl || fileUrl}
        rel='noreferrer'
        target='_blank'
        download={fileType === 'file' ? filename || undefined : undefined}
        className='inline-flex items-center gap-x-0.5 px-1.5 my-1.5 rounded-md bg-base-content/10 hover:bg-base-content/20'
      >
        {/* <BsLink45Deg className='text-[1.2em]' /> */}
        🔗&nbsp;
        {decodeURIComponent(filename || 'File')}
      </a>
      {Array.isArray((block?.file as Record<string, unknown>)?.['caption']) && ((block?.file as Record<string, unknown>)?.['caption'] as unknown[])?.length > 0 && (
        <div className='w-full'>
          <NotionParagraphBlock blockId={block.id} richText={(block.file as Record<string, unknown>)['caption'] as never[]} color='gray' />
        </div>
      )}
    </div>
  );
};
