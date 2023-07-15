import { IErrorResponse } from 'lib/types/response';

export const ERROR_NOT_FOUND_FILE: IErrorResponse = {
  status: 404,
  error: 'The file you are looking for is not found.',
  success: false,
};

export const ERROR_UNAUTHORIZED: IErrorResponse = {
  error: 'Please log in.',
  status: 401,
  success: false,
};

export const ERROR_AUTHENTICATION_ROLE: IErrorResponse = {
  error: 'You do not have permission.',
  status: 403,
  success: false,
};
