import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { siteConfig } from 'site-config';
import type { FileObject, IconObject } from 'src/types/notion';

import { isExpired, type NotionImageFetcherParams, useRenewExpiredFile } from './utils';

/* eslint-disable @next/next/no-img-element */
interface NotionSecureImageProps extends NotionImageFetcherParams {
  alt?: HTMLImageElement['alt'];
  loading?: HTMLImageElement['loading'];
  useNextImage?: boolean;
  quality?: number;
  sizes?: {
    width: number;
    height: number;
  };
}

export const NotionSecureImage: React.FC<NotionSecureImageProps> = ({
  blockId,
  blockType,
  useType,
  initialFileObject,
  alt,
  loading,
  quality,
  sizes,
  useNextImage = false
}): React.JSX.Element => {
  const [isOriginalImageLoaded, setOriginalImageLoaded]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(
    initialFileObject?.file?.url ? !isExpired(initialFileObject?.file) : true
  );
  const cachedFileObject: React.MutableRefObject<(FileObject & IconObject) | undefined> = useRef<
    (FileObject & IconObject) | undefined
  >(initialFileObject as FileObject & IconObject);

  const { data: fileObject }: { data: (FileObject & IconObject) | undefined } = useRenewExpiredFile({
    blockId,
    blockType,
    useType,
    ...(cachedFileObject.current ? { initialFileObject: cachedFileObject.current } : {}),
    autoRefresh: loading !== 'eager'
  } as Parameters<typeof useRenewExpiredFile>[0]);

  const bulrImage: string | null = null;

  useEffect(() => {
    if (isOriginalImageLoaded) {
      cachedFileObject.current = fileObject;
    }
  }, [fileObject, isOriginalImageLoaded]);

  return (
    <div className='image-wrapper relative'>
      {bulrImage && !isOriginalImageLoaded && !fileObject?.external?.url && (
        <>
          <img className='image w-full h-full blur-md' alt={alt} src={bulrImage} loading='eager' />
          <div className='absolute top-0 left-0 w-full h-full flex-center text-4xl text-white rounded-xl opacity-70 pointer-events-none md:text-5xl md:rounded-3xl'>
            <div className='animate-spin'>
              <AiOutlineLoading3Quarters className='drop-shadow-[0_0_2px_#000000]' />
            </div>
          </div>
        </>
      )}
      {(fileObject?.file && !isExpired(fileObject?.file)) || fileObject?.external?.url ? (
        siteConfig.enableImageOptimization && useNextImage ? (
          <Image
            key='nextImage'
            className={classNames(
              'image',
              isOriginalImageLoaded ? null : 'opacity-0 w-0 h-0 absolute top-0 left-0'
            )}
            loading={loading || 'eager'}
            src={fileObject?.file?.url || fileObject?.external?.url || ''}
            alt={alt!}
            {...(sizes ? { width: sizes.width, height: sizes.height } : { fill: true })}
            {...(quality !== undefined ? { quality } : {})}
            onLoad={(): void => {
              if (!isOriginalImageLoaded) {
                setOriginalImageLoaded(true);
              }
            }}
          />
        ) : (
          <img
            key='originImage'
            className={classNames(
              'image',
              isOriginalImageLoaded ? null : 'opacity-0 w-0 h-0 absolute top-0 left-0'
            )}
            loading={loading || 'eager'}
            src={fileObject?.file?.url || fileObject?.external?.url || ''}
            alt={alt}
            onLoad={(): void => {
              if (!isOriginalImageLoaded) {
                setOriginalImageLoaded(true);
              }
            }}
          />
        )
      ) : null}
    </div>
  );
};
