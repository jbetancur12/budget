import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, status: number = 200) {
    return res.status(status).json({ status: 'success', data });
  }

  static error(res: Response, message: string, status: number = 500, errors?: unknown) {
    return res.status(status).json({
      status: 'error',
      message,
      ...(errors ? { errors } : {}),
    });
  }

  static created<T>(res: Response, data: T) {
    return ApiResponse.success(res, data, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
