import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../controllers/interfaces/authenticatedReq';

export const mapUserToTask = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
) => {
    req.body.UserId = req.payload.userInfo.id;
    next();
};
