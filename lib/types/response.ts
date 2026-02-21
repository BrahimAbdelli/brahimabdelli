export interface ResponseDefault {
  success: boolean;
}

export interface ErrorResponse extends ResponseDefault {
  status: number;
  error: string;
  message?: string;
  code?: number;
}

export interface ResponseSuccess<T> extends ResponseDefault {
  result: T;
}
