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

    public getCreateDto(taskFormData: TaskCreateDto, hours: number = 0): ILogCreateDto {
        const dto: any = {};
        dto.name = taskFormData.name;
        dto.projectNumber = taskFormData.projectNumber;
        dto.hoursAvailableToWork = taskFormData.hoursAvailableToWork;
        dto.hoursWorked = taskFormData.hoursWorked;
        dto.notes = taskFormData.notes;
        dto.numberOfReviews = taskFormData.numberOfReviews;
        dto.hoursRequiredByBim = taskFormData.hoursRequiredByBim;
        dto.productiveHours = hours > 0 ? hours : taskFormData.hoursWorked;
        dto.hoursRemaining = taskFormData.hoursRemaining;
        dto.reviewHours = taskFormData.reviewHours;

        return new LogCreateDto(dto);
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
