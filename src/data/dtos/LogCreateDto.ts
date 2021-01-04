import { ILogCreateDto } from '../interfaces/ILogCreateDto';

export class LogCreateDto implements ILogCreateDto {
  public name: string;
  public projectNumber: number;
  public hoursAvailableToWork: number;
  public hoursWorked: number;
  public hoursRemaining: number;
  public notes: string | null;
  public numberOfReviews: number;
  public reviewHours: number;
  public hoursRequiredByBim: number;
  public complete: boolean;
  public day: number;
  public weekOf: string;
  public productiveHours: number;

  public constructor(props: ILogCreateDto) {
    this.name = props.name;
    this.projectNumber = props.projectNumber;
    this.hoursAvailableToWork = props.hoursAvailableToWork;
    this.hoursWorked = props.hoursWorked;
    this.hoursRemaining = props.hoursRemaining;
    this.notes = props.notes;
    this.numberOfReviews = props.numberOfReviews;
    this.reviewHours = props.reviewHours;
    this.hoursAvailableToWork = props.hoursAvailableToWork;
    this.hoursRequiredByBim = props.hoursRequiredByBim;
    this.complete = props.complete;
    this.day = props.day;
    this.weekOf = props.weekOf;
    this.productiveHours = props.productiveHours;
  }
}
