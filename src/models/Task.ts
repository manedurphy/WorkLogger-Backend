import { Model } from 'sequelize';
import { TaskAttributes, TaskCreationAttributes } from './interfaces/ITask';

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes {
  public id!: number;
  public name!: string;
  public projectNumber!: number;
  public hoursAvailableToWork!: number;
  public hoursWorked!: number;
  public hoursRemaining!: number;
  public notes!: string | null;
  public numberOfReviews!: number;
  public reviewHours!: number;
  public hoursRequiredByBim!: number;
  public complete!: boolean;
  public UserId!: number;
  public dateAssigned!: Date;
  public dueDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
