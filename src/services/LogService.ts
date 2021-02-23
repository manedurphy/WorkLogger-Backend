import { inject, injectable } from 'inversify';
import { Types } from '../constants/Types';
import { LogCreateDto } from '../data/dtos/LogCreateDto';
import { ILogCreateDto } from '../data/interfaces/ILogCreateDto';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { Log } from '../models';
import { TaskCreateDto } from '../data/dtos/TaskCreateDto';

@injectable()
export class LogService {
    private readonly logRepository: ILogRepository;

    constructor(@inject(Types.LogRepository) logRepository: ILogRepository) {
        this.logRepository = logRepository;
    }

    public getCreateDto(taskFormData: TaskCreateDto, hours: number): ILogCreateDto {
        return new LogCreateDto({
            name: taskFormData.name,
            projectNumber: taskFormData.projectNumber,
            hoursAvailableToWork: taskFormData.hoursAvailableToWork,
            hoursWorked: taskFormData.hoursWorked,
            hoursRemaining: taskFormData.hoursRemaining,
            numberOfReviews: taskFormData.numberOfReviews,
            notes: taskFormData.notes,
            reviewHours: taskFormData.reviewHours,
            hoursRequiredByBim: taskFormData.hoursRequiredByBim,
            complete: false,
            productiveHours: hours,
        });
    }

    public addHours(log: Log, hours: number): ILogCreateDto {
        return new LogCreateDto({
            name: log.name,
            projectNumber: log.projectNumber,
            hoursAvailableToWork: log.hoursAvailableToWork,
            hoursWorked: +log.hoursWorked + hours,
            hoursRemaining: log.hoursRemaining - hours,
            notes: log.notes,
            numberOfReviews: log.numberOfReviews,
            reviewHours: log.reviewHours,
            hoursRequiredByBim: log.hoursRequiredByBim,
            complete: log.complete,
            productiveHours: hours,
        });
    }

    public async getHoursWorkedAfterDelete(log: Log[], hours: number) {
        let sum = 0;

        for (let i = log.length - 1; i >= 0; i--) {
            if (log[i].productiveHours < 0) {
                log[i].productiveHours = +log[i].productiveHours + hours;
            }
            sum += +log[i].productiveHours;
            log[i].hoursWorked = sum;
            log[i].hoursRemaining =
                log[i].hoursAvailableToWork - log[i].hoursWorked - log[i].hoursRequiredByBim - log[i].reviewHours;
            await this.logRepository.save(log[i]);
        }

        return sum;
    }

    public async getHoursWorkedAfterUpdate(log: Log[]) {
        let sum = 0;

        for (let i = log.length - 1; i >= 0; i--) {
            if (i === log.length - 1) {
                log[i].productiveHours = +log[i].hoursWorked;
                sum += +log[i].hoursWorked;
            } else {
                const diff = +log[i].hoursWorked - +log[i + 1].hoursWorked;
                sum += diff;
                log[i].productiveHours = diff;
            }
            log[i].hoursRemaining =
                log[i].hoursAvailableToWork - log[i].hoursWorked - log[i].hoursRequiredByBim - log[i].reviewHours;
            await this.logRepository.save(log[i]);
        }

        return sum;
    }
}
