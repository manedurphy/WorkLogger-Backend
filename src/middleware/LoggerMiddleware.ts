import { Logger } from '@overnightjs/logger';
import { NextFunction, Request, Response } from 'express';

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.Info(`${req.method} ${req.route.path}`);
  next();
};
