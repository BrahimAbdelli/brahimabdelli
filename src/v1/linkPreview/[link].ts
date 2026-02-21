import axios, { type AxiosResponse } from 'axios';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
// @ts-expect-error next-connect types
import nc from 'next-connect';
import { ApiError } from 'lib/Error';
import { ResponseSuccess } from 'lib/types/response';
import { parse } from 'node-html-parser';
import type { HTMLElement as ParsedHTMLElement } from 'node-html-parser';
import { LinkPreview } from 'src/types/types';

async function fetchHead(link: string): Promise<ParsedHTMLElement> {
  const response: AxiosResponse<string> = await axios.get(link);
  const headElement: ParsedHTMLElement | null = parse(response.data).querySelector('head');
  if (typeof response.data === 'string' && headElement !== null) {
    return headElement;
  }
  const error: Error = new Error(`request error "${link}"`);
  throw error;
}

function buildLinkPreview(head: ParsedHTMLElement): LinkPreview {
  return {
    icon: getIcon(head),
    title: getTitle(head),
    description: getDescription(head),
    image: getOpenGraphImage(head),
    username: getUserName(head),
    type: getOpenGraphType(head),
    media: getOpenGraphMedia(head)
  };
}

export async function handleGetRequest(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess<LinkPreview>>
): Promise<void> {
  if (typeof req.query['link'] !== 'string') {
    throw new TypeError('type error "link"');
  }

  const link: string = decodeURIComponent(req.query['link']);

  try {
    const head: ParsedHTMLElement = await fetchHead(link);
    const preview: LinkPreview = buildLinkPreview(head);
    res.status(200).json({
      success: true,
      result: preview
    });
  } catch {
    const error: Error = new Error(`request error "${link}"`);
    throw error;
  }
}

const handler: NextApiHandler = nc<NextApiRequest, NextApiResponse>({
  onError: ApiError.handleError,
  onNoMatch: ApiError.handleNoMatch
}).get(handleGetRequest);

export function getIcon(html: ParsedHTMLElement): string | null {
  const iconHref: string | undefined = html.querySelector('link[rel~=icon]')?.getAttribute('href');
  if (iconHref !== undefined && iconHref !== null) {
    return iconHref;
  }
  const metaContent: string | undefined = html.querySelector('meta[property=og:icon]')?.getAttribute('content');
  if (metaContent !== undefined && metaContent !== null) {
    return metaContent;
  }
  return null;
}

export function getTitle(html: ParsedHTMLElement): string | null {
  const title: string | undefined = html.querySelector('title')?.textContent;
  if (title !== undefined && title !== null) {
    return title;
  }
  const metaContent: string | undefined = html.querySelector('meta[property=og:title]')?.getAttribute('content');
  if (metaContent !== undefined && metaContent !== null) {
    return metaContent;
  }
  return null;
}

export function getDescription(html: ParsedHTMLElement): string | null {
  const metaDescriptionContent: string | undefined = html
    .querySelector('meta[name=description]')
    ?.getAttribute('content');
  if (metaDescriptionContent !== undefined && metaDescriptionContent !== null) {
    return metaDescriptionContent;
  }
  const metaContent: string | undefined = html
    .querySelector('meta[property=og:description]')
    ?.getAttribute('content');
  if (metaContent !== undefined && metaContent !== null) {
    return metaContent;
  }
  return null;
}

export function getOpenGraphImage(html: ParsedHTMLElement): { url: string | null; alt: string | null } {
  return {
    url: html.querySelector('meta[property=og:image]')?.getAttribute('content') ?? null,
    alt: html.querySelector('meta[property=og:image:alt]')?.getAttribute('content') ?? null
  };
}

export function getOpenGraphType(html: ParsedHTMLElement): string | null {
  return html.querySelector('meta[property=og:type]')?.getAttribute('content') ?? null;
}

export function getUserName(html: ParsedHTMLElement): string | null {
  return html.querySelector('meta[property=profile:username]')?.getAttribute('content') ?? null;
}

export function getOpenGraphMedia(html: ParsedHTMLElement): string | null {
  return html.querySelector('meta[property=og:media:url]')?.getAttribute('content') ?? null;
}

export default handler;
