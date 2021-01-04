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
  loggedAt: Date;
  TaskId: number;
  UserId: number;
}

export interface LogCreationAttributes extends Optional<LogAttributes, 'id'> {}
