import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../controllers/interfaces/authenticatedReq';

export const MapUserToTask = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    req.body.UserId = req.payload.userInfo.id;
    next();
};
