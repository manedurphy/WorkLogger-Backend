import { inject, injectable } from 'inversify';
import { Types } from '../constants/Types';
import { LogCreateDto } from '../data/dtos/LogCreateDto';
import { ILogCreateDto } from '../data/interfaces/ILogCreateDto';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { Log } from '../models';

@injectable()
export class LogService {
    private readonly logRepository: ILogRepository;

    constructor(@inject(Types.LogRepository) logRepository: ILogRepository) {
        this.logRepository = logRepository;
    }

    private GetSunday() {
        const date = new Date();
        date.setDate(date.getDate() - (date.getDay() || 7));
        return date.toString().slice(0, 15);
    }

    private GetLastSunday() {
        const lastSunday = new Date();
        lastSunday.setDate(
            lastSunday.getDate() - (lastSunday.getDay() || 7) - 7
        );

        return lastSunday.toString().slice(0, 15);
    }

    private GetToday() {
        const date = new Date();
        return date.getDay();
    }

    public mapProps(
        body: ILogCreateDto,
        hoursWorked: number | null
    ): LogCreateDto {
        body.weekOf = this.GetSunday();
        body.day = this.GetToday();
        body.productiveHours =
            hoursWorked !== null ? hoursWorked : body.hoursWorked;

        return new LogCreateDto(body);
    }

    public LogMatchesUser(logItem: Log, userId: number): boolean {
        return logItem.UserId === userId;
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
                log[i].hoursAvailableToWork -
                log[i].hoursWorked -
                log[i].hoursRequiredByBim -
                log[i].reviewHours;
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
                log[i].hoursAvailableToWork -
                log[i].hoursWorked -
                log[i].hoursRequiredByBim -
                log[i].reviewHours;
            await this.logRepository.save(log[i]);
        }

        return sum;
    }
}
