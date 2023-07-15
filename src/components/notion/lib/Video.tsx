import queryString from 'querystring';

import type React from 'react';
import { useEffect, useRef } from 'react';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

import NoSsrWrapper from 'src/components/modules/NoSsrWrapper';
import type { NotionBlocksRetrieve } from 'src/types/notion';

import { NotionParagraphBlock } from '.';
import { useRenewExpiredFile } from './utils';

interface VideoProps {
  block: NotionBlocksRetrieve;
}

const VideoBlockInner: React.FC<VideoProps> = ({ block }) => {
  const cachedFileObject = useRef(block.video);

  const {
    data: fileObject,
    isValidating,
    error,
  } = useRenewExpiredFile({
    blockId: block.id,
    blockType: 'video',
    useType: 'video',
    initialFileObject: cachedFileObject.current,
  });

  useEffect(() => {
    cachedFileObject.current = fileObject as typeof cachedFileObject.current;
  }, [fileObject]);

  if (!fileObject || error) {
    return (
      <div className="flex-center py-0.5 bg-gray-900">
        <div className="flex items-center text-notion-red">
          <IoClose />
        </div>
        &nbsp;
        <p>Not found video.</p>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="flex-center py-2 bg-gray-900">
        <div className="flex items-center animate-spin">
          <AiOutlineLoading3Quarters />
        </div>
        &nbsp;
        <p>video validating...</p>
      </div>
    );
  }

  if (fileObject?.type === 'file') {
    return (
      <video
        className="w-full aspect-video"
        controls
        src={fileObject?.file?.url}
      />
    );
  }
  return (
    <div className="w-full [&>iframe]:w-full [&>iframe]:aspect-video ">
      <EmbedVideo url={block.video?.external?.url || ''} />
    </div>
  );
};

export const Video: React.FC<VideoProps> = ({ block }) => {
  return (
    <>
      <NoSsrWrapper>
        <VideoBlockInner block={block}></VideoBlockInner>
      </NoSsrWrapper>
      {Array.isArray(block?.video?.caption) &&
        block?.video?.caption?.length > 0 && (
          <div className="w-full">
            <NotionParagraphBlock
              blockId={block.id}
              richText={block.video.caption}
              color={'gray'}
            />
          </div>
        )}
    </>
  );
};

const EmbedVideo: React.FC<{ url: string }> = ({ url }) => {
  const originalURL = new URL(url);

  switch (originalURL.hostname) {
    case 'youtube.com':
    case 'www.youtube.com': {
      // const embedUrl = url.replace(/\/watch\?v=/, '/embed/');
      let embedUrl = '';
      const urlSearch =
        originalURL.search.charAt(0) === '?'
          ? originalURL.search.slice(1)
          : originalURL.search;
      const searchParams = queryString.decode(urlSearch);

      if (
        originalURL.pathname === '/watch' &&
        typeof searchParams.v === 'string'
      ) {
        const { v: _, ...newSearchParams } = searchParams;
        embedUrl = `https://www.youtube.com/embed/${
          searchParams.v
        }?${queryString.encode(newSearchParams)}`;
      }

      return (
        <iframe
          src={embedUrl || url}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }

    default: {
      return (
        <iframe
          src={url}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }
  }
};