import { Optional } from 'sequelize';

export interface LogAttributes {
    id: number;
    name: string;
    projectNumber: number;
    hoursAvailableToWork: number;
    hoursWorked: number;
    hoursRemaining: number;
    notes: string | null;
    numberOfReviews: number;
    reviewHours: number;
    hoursRequiredByBim: number;
    complete: boolean;
    weekOf: string;
    productiveHours: number;
    loggedAt: Date;
    TaskId: number;
    UserId: number;
}

export type LogCreationAttributes = Optional<LogAttributes, 'id'>;
