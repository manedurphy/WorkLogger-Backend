import { injectable } from 'inversify';
import { Log, Task } from '../models';
import { ValidationService } from './ValidationService';

@injectable()
export class TaskService extends ValidationService {
    public constructor() {
        super();
    }

    public matchLatestLog(task: Task, logItem: Log): void {
        task.name = logItem.name;
        task.hoursWorked = logItem.hoursWorked;
        task.hoursRemaining = logItem.hoursRemaining;
        task.hoursRequiredByBim = logItem.hoursRequiredByBim;
        task.reviewHours = logItem.reviewHours;
        task.notes = logItem.notes;
        task.hoursAvailableToWork = logItem.hoursAvailableToWork;
        task.numberOfReviews = logItem.numberOfReviews;
    }
}
