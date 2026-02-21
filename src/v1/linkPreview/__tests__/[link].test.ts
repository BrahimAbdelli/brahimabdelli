import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'node-html-parser';
import type { HTMLElement as ParsedHTMLElement } from 'node-html-parser';

jest.mock('next-connect', () => {
  return jest.fn(() => ({
    get: jest.fn()
  }));
});

import {
  handleGetRequest,
  getIcon,
  getTitle,
  getDescription,
  getOpenGraphImage,
  getOpenGraphType,
  getUserName,
  getOpenGraphMedia
} from '../[link]';
import { ResponseSuccess } from 'lib/types/response';
import { LinkPreview } from 'src/types/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockRequest = (query: Record<string, string | string[]>): NextApiRequest => {
  return {
    query,
    method: 'GET',
    headers: {},
    body: {},
    cookies: {},
    url: '',
    statusCode: undefined,
    statusMessage: undefined
  } as NextApiRequest;
};

const mockResponse = (): NextApiResponse<ResponseSuccess<LinkPreview>> => {
  const res: Partial<NextApiResponse<ResponseSuccess<LinkPreview>>> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis()
  };
  return res as NextApiResponse<ResponseSuccess<LinkPreview>>;
};

const createMockHead = (htmlContent: string): ParsedHTMLElement => {
  const fullHtml: string = `<html><head>${htmlContent}</head><body></body></html>`;
  const parsed: ParsedHTMLElement | null = parse(fullHtml).querySelector('head');
  if (parsed === null) {
    throw new Error('Failed to parse head element');
  }
  return parsed;
};

describe('linkPreview API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleGetRequest', () => {
    it('returns link preview data successfully', async () => {
      const htmlContent: string = `
        <title>Test Title</title>
        <meta name="description" content="Test Description" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/image.jpg" />
        <meta property="og:image:alt" content="Test Image" />
      `;
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const mockHtml: string = `<html><head>${htmlContent}</head><body></body></html>`;

      mockedAxios.get.mockResolvedValueOnce({
        data: mockHtml,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
      });

      const req: NextApiRequest = mockRequest({ link: 'https://example.com' });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await handleGetRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        result: expect.objectContaining({
          title: 'Test Title',
          description: 'Test Description',
          icon: '/favicon.ico',
          image: {
            url: '/image.jpg',
            alt: 'Test Image'
          }
        })
      });
    });

    it('handles missing link query parameter', async () => {
      const req: NextApiRequest = mockRequest({});
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await expect(handleGetRequest(req, res)).rejects.toThrow(TypeError);
    });

    it('handles invalid link query parameter type', async () => {
      const req: NextApiRequest = mockRequest({ link: ['multiple', 'values'] });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await expect(handleGetRequest(req, res)).rejects.toThrow(TypeError);
    });

    it('handles axios request error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const req: NextApiRequest = mockRequest({ link: 'https://invalid-url.com' });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await expect(handleGetRequest(req, res)).rejects.toThrow();
    });

    it('handles invalid HTML response', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
      });

      const req: NextApiRequest = mockRequest({ link: 'https://example.com' });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await expect(handleGetRequest(req, res)).rejects.toThrow();
    });

    it('handles HTML without head element', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: '<html><body></body></html>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
      });

      const req: NextApiRequest = mockRequest({ link: 'https://example.com' });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await expect(handleGetRequest(req, res)).rejects.toThrow();
    });

    it('handles encoded link parameter', async () => {
      const htmlContent: string = '<title>Encoded Test</title>';
      const mockHtml: string = `<html><head>${htmlContent}</head><body></body></html>`;

      mockedAxios.get.mockResolvedValueOnce({
        data: mockHtml,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
      });

      const encodedLink: string = encodeURIComponent('https://example.com/page?param=value');
      const req: NextApiRequest = mockRequest({ link: encodedLink });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await handleGetRequest(req, res);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://example.com/page?param=value');
    });

    it('returns all Open Graph properties', async () => {
      const htmlContent: string = `
        <meta property="og:title" content="OG Title" />
        <meta property="og:description" content="OG Description" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:image:alt" content="OG Image Alt" />
        <meta property="og:media:url" content="/media.mp4" />
        <meta property="profile:username" content="testuser" />
      `;
      const mockHtml: string = `<html><head>${htmlContent}</head><body></body></html>`;

      mockedAxios.get.mockResolvedValueOnce({
        data: mockHtml,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
      });

      const req: NextApiRequest = mockRequest({ link: 'https://example.com' });
      const res: NextApiResponse<ResponseSuccess<LinkPreview>> = mockResponse();

      await handleGetRequest(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        result: {
          title: 'OG Title',
          description: 'OG Description',
          icon: null,
          image: {
            url: '/og-image.jpg',
            alt: 'OG Image Alt'
          },
          type: 'website',
          media: '/media.mp4',
          username: 'testuser'
        }
      });
    });
  });

  describe('getIcon', () => {
    it('returns icon from link rel="icon"', () => {
      const htmlContent: string = '<link rel="icon" href="/favicon.ico" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const icon: string | null = getIcon(mockHead);
      expect(icon).toBe('/favicon.ico');
    });

    it('returns icon from og:icon meta tag', () => {
      const htmlContent: string = '<meta property="og:icon" content="/icon.png" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const icon: string | null = getIcon(mockHead);
      expect(icon).toBe('/icon.png');
    });

    it('returns null when no icon found', () => {
      const htmlContent: string = '<title>No Icon</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const icon: string | null = getIcon(mockHead);
      expect(icon).toBeNull();
    });
  });

  describe('getTitle', () => {
    it('returns title from title tag', () => {
      const htmlContent: string = '<title>Page Title</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const title: string | null = getTitle(mockHead);
      expect(title).toBe('Page Title');
    });

    it('returns title from og:title meta tag when title tag missing', () => {
      const htmlContent: string = '<meta property="og:title" content="OG Title" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const title: string | null = getTitle(mockHead);
      expect(title).toBe('OG Title');
    });

    it('returns null when no title found', () => {
      const htmlContent: string = '<meta name="description" content="Test" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const title: string | null = getTitle(mockHead);
      expect(title).toBeNull();
    });
  });

  describe('getDescription', () => {
    it('returns description from meta name="description"', () => {
      const htmlContent: string = '<meta name="description" content="Test Description" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const description: string | null = getDescription(mockHead);
      expect(description).toBe('Test Description');
    });

    it('returns description from og:description when meta name missing', () => {
      const htmlContent: string = '<meta property="og:description" content="OG Description" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const description: string | null = getDescription(mockHead);
      expect(description).toBe('OG Description');
    });

    it('returns null when no description found', () => {
      const htmlContent: string = '<title>No Description</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const description: string | null = getDescription(mockHead);
      expect(description).toBeNull();
    });
  });

  describe('getOpenGraphImage', () => {
    it('returns image URL and alt', () => {
      const htmlContent: string = `
        <meta property="og:image" content="/image.jpg" />
        <meta property="og:image:alt" content="Image Alt" />
      `;
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const image: { url: string | null; alt: string | null } = getOpenGraphImage(mockHead);
      expect(image).toEqual({
        url: '/image.jpg',
        alt: 'Image Alt'
      });
    });

    it('returns null for missing image properties', () => {
      const htmlContent: string = '<title>No Image</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const image: { url: string | null; alt: string | null } = getOpenGraphImage(mockHead);
      expect(image).toEqual({
        url: null,
        alt: null
      });
    });
  });

  describe('getOpenGraphType', () => {
    it('returns type from og:type meta tag', () => {
      const htmlContent: string = '<meta property="og:type" content="article" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const type: string | null = getOpenGraphType(mockHead);
      expect(type).toBe('article');
    });

    it('returns null when no type found', () => {
      const htmlContent: string = '<title>No Type</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const type: string | null = getOpenGraphType(mockHead);
      expect(type).toBeNull();
    });
  });

  describe('getUserName', () => {
    it('returns username from profile:username meta tag', () => {
      const htmlContent: string = '<meta property="profile:username" content="testuser" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const username: string | null = getUserName(mockHead);
      expect(username).toBe('testuser');
    });

    it('returns null when no username found', () => {
      const htmlContent: string = '<title>No Username</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const username: string | null = getUserName(mockHead);
      expect(username).toBeNull();
    });
  });

  describe('getOpenGraphMedia', () => {
    it('returns media URL from og:media:url meta tag', () => {
      const htmlContent: string = '<meta property="og:media:url" content="/media.mp4" />';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const media: string | null = getOpenGraphMedia(mockHead);
      expect(media).toBe('/media.mp4');
    });

    it('returns null when no media found', () => {
      const htmlContent: string = '<title>No Media</title>';
      const mockHead: ParsedHTMLElement = createMockHead(htmlContent);
      const media: string | null = getOpenGraphMedia(mockHead);
      expect(media).toBeNull();
    });
  });
});
