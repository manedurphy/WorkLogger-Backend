import { Optional } from 'sequelize';

export interface TaskAttributes {
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
  dateAssigned: Date;
  dueDate: Date;
  UserId: number;
}

export interface TaskCreationAttributes
  extends Optional<TaskAttributes, 'id'> {}
