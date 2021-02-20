import { NextFunction, Request, Response } from 'express';

export const CalculateHoursRemaining = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const hoursRemaining =
        req.body.hoursAvailableToWork -
        req.body.hoursWorked -
        req.body.hoursRequiredByBim -
        req.body.reviewHours;
    req.body.hoursRemaining = hoursRemaining;
    next();
};
