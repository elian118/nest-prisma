import { NextFunction, Request, Response } from 'express';
import { blue, green, red, yellow } from './src/config/utils';

export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl } = req;

  const coloredMethod =
    method === 'GET'
      ? blue(method)
      : method === 'DELETE'
        ? red(method)
        : green(method);

  res.on('finish', () => {
    const end = Date.now();
    const resTime = end - start;
    const statusMsg = `${res.statusCode} ${res.statusMessage}`;

    const coloredStatusCode =
      res.statusCode >= 200 && res.statusCode < 300
        ? blue(statusMsg)
        : res.statusCode >= 400 && res.statusCode < 600
          ? red(statusMsg)
          : yellow(statusMsg);

    console.log(
      `${coloredMethod} ${originalUrl} ➤ ${coloredStatusCode} - Duration: ${resTime}ms`,
    );
  });

  next();
}
