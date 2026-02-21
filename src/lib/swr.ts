import axios from 'axios';
import type { AxiosResponse } from 'axios';

import { ResponseSuccess } from 'lib/types/response';

export const fetcher: <T>(url: string) => Promise<T> = async <T>(url: string): Promise<T> => {
  return axios.get<ResponseSuccess<T>>(url).then((res: AxiosResponse<ResponseSuccess<T>>): T => {
    if (!res.data.success) {
      const error: Error = new Error('API request failed');
      throw error;
    }
    return res.data.result;
  });
};
