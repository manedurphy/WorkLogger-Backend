import { NextFunction, Request, Response } from 'express';

export const calculateHoursRemaining = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const hoursRemaining =
        +req.body.hoursAvailableToWork -
        +req.body.hoursWorked -
        +req.body.hoursRequiredByBim -
        +req.body.reviewHours;
    req.body.hoursRemaining = hoursRemaining;
    next();
};
