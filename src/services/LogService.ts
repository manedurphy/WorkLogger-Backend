import { injectable } from 'inversify';
import { LogCreateDto } from '../data/dtos/LogCreateDto';
import { ILogCreateDto } from '../data/interfaces/ILogCreateDto';

@injectable()
export class LogService {
  private GetSunday() {
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() || 7));
    return date.toString().slice(0, 15);
  }

  private GetLastSunday() {
    const lastSunday = new Date();
    lastSunday.setDate(lastSunday.getDate() - (lastSunday.getDay() || 7) - 7);

    return lastSunday.toString().slice(0, 15);
  }

  private GetToday() {
    const date = new Date();
    return date.getDay();
  }

  public MapProps(body: ILogCreateDto, hoursWorked: number): LogCreateDto {
    body.weekOf = this.GetSunday();
    body.day = this.GetToday();
    body.productiveHours = hoursWorked;

    return new LogCreateDto(body);
  }
}
