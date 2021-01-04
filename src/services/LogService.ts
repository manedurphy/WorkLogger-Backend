import { injectable } from 'inversify';
import { Task } from '../models';

@injectable()
export class LogService {
  public GetSunday() {
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() || 7));
    return date.toString().slice(0, 15);
  }

  public GetLastSunday() {
    const lastSunday = new Date();
    lastSunday.setDate(lastSunday.getDate() - (lastSunday.getDay() || 7) - 7);

    return lastSunday.toString().slice(0, 15);
  }

  public GetToday() {
    const date = new Date();
    return date.getDay();
  }
}
