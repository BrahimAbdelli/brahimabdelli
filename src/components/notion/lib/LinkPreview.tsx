/* eslint-disable @next/next/no-img-element */
import type React from 'react';

import { AiOutlineLink, AiOutlineLoading } from 'react-icons/ai';
import useSWR from 'swr';

import { siteConfig } from 'site-config';
import { notionBlockUrlToRelativePath } from 'src/lib/notion';
import { fetcher } from 'src/lib/swr';
import type { LinkPreview as ILinkPreview } from 'src/types/types';

import { NotionParagraphText } from '.';

export interface LinkPreviewProps {
  url: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const { data, error, isValidating } = useSWR<ILinkPreview>(
    `${siteConfig.path}/linkPreview/${encodeURIComponent(url)}`,
    fetcher,
    {
      fallbackData: {
        username: null,
        description: null,
        icon: null,
        image: {
          alt: null,
          url: null
        },
        media: null,
        title: null,
        type: null
      },
      revalidateOnFocus: false
    }
  );

  const relativePath = notionBlockUrlToRelativePath(url);

  if (error) {
    return (
      <a className='underline' href={relativePath} rel='noreferrer' target='_blank'>
        <NotionParagraphText>{url}</NotionParagraphText>
      </a>
    );
  }

  return (
    <a href={relativePath} className='block my-2' rel='noreferrer' target='_blank'>
      <div className='card card-side flex-row h-[150px] rounded-md border border-base-content/10 bg-base-100 overflow-hidden dark:bg-base-content/5'>
        <div className='px-4 py-3 card-body bg-base-content/5 basis-[60%] md:basis-[65%]'>
          <h2 className='text-sm card-title line-clamp-2 md:text-lg md:leading-6'>
            {isValidating ? (
              <AiOutlineLoading className='text-inherit animate-spin' />
            ) : (
              <NotionParagraphText>{data?.title}</NotionParagraphText>
            )}
          </h2>
          <p className='flex-grow-0 hidden text-xs sm:line-clamp-2 sm:block text-notion-gray'>
            <NotionParagraphText>{data?.description}</NotionParagraphText>
          </p>
          <div className='mt-auto text-xs'>
            <div className='flex-grow-0 gap-x-1 text-ellipsis'>
              <p className='line-clamp-2'>
                {isValidating || !data?.icon ? (
                  <AiOutlineLink className='inline-block align-text-bottom text-[1.1em]' />
                ) : (
                  <img
                    className='inline-block w-[1.1em] h-[1.1em] align-text-bottom mr-1'
                    src={data.icon.charAt(0) === '/' ? new URL(data.icon, url).href : data.icon}
                    alt={`${data?.title || ''}-favicon`}
                    loading='lazy'
                  />
                )}
                {url}
              </p>
            </div>
          </div>
        </div>
        {data?.image?.url || isValidating ? (
          <figure className='image-wrapper min-h-full basis-[40%] md:basis-[35%] overflow-hidden'>
            {isValidating ? (
              <AiOutlineLoading className='w-[30px] h-[30px] animate-spin' />
            ) : (
              data?.image?.url && (
                <img
                  className='w-full sm:h-full min-h-[200px] max-h-[200px] sm:min-h-[125px] sm:max-h-[initial]'
                  src={
                    data.image.url.charAt(0) === '/'
                      ? new URL(data.image.url, url).href
                      : data.image.url
                  }
                  alt={data?.image?.alt ?? undefined}
                  loading='lazy'
                />
              )
            )}
          </figure>
        ) : null}
      </div>
    </a>
  );
};