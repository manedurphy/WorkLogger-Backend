import { Logger } from '@overnightjs/logger';
import { NextFunction, Request, Response } from 'express';

export const logRoute = (req: Request, _res: Response, next: NextFunction) => {
    Logger.Info(`${req.method} ${req.route.path}`);
    next();
};
