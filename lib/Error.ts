import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

import { ErrorResponse } from 'lib/types/response';

export class ApiError {
  static handleError(
    err: ErrorResponse,
    _req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>,
    _next?: NextHandler
  ): void {
    if (typeof err === 'string') {
      res.status(400).json({
        status: 400,
        error: err || 'Something broke!',
        success: false,
      });
      res.end();
      return;
    }
    res.status(err.status || 400).json({
      status: err?.status || 400,
      error: err?.error || err?.message || 'Something broke!',
      success: err?.success || false,
      ...(err?.code !== undefined && { code: err.code }),
    });
    res.end();
  }

  static handleNoMatch(_req: NextApiRequest, res: NextApiResponse): void {
    res.status(404).end('Page is not found');
  }
}
