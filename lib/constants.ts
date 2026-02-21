import { ErrorResponse } from 'lib/types/response';

export const ERROR_NOT_FOUND_FILE: ErrorResponse = {
  status: 404,
  error: 'The file you are looking for is not found.',
  success: false,
};

export const ERROR_UNAUTHORIZED: ErrorResponse = {
  error: 'Please log in.',
  status: 401,
  success: false,
};

export const ERROR_AUTHENTICATION_ROLE: ErrorResponse = {
  error: 'You do not have permission.',
  status: 403,
  success: false,
};
