import { Model } from 'sequelize';
import { LogAttributes, LogCreationAttributes } from './interfaces/ILog';
export class Log
  extends Model<LogAttributes, LogCreationAttributes>
  implements LogAttributes {
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
  public loggedAt!: Date;
  public TaskId!: number;
  public UserId!: number;

  public readonly createdAt!: Date;
}
