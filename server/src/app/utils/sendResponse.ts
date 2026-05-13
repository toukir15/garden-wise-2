import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: { total: number; page: number; limit: number; [key: string]: any };
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const body: Record<string, unknown> = {
    success: data.success,
    message: data.message,
    data: data.data,
  };
  if (data.meta) body.meta = data.meta;
  res.status(data?.statusCode).json(body);
};

export default sendResponse;
