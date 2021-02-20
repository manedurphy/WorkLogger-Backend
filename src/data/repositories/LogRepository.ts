import { injectable } from 'inversify';
import { Log, Task } from '../../models';
import { LogCreateDto } from '../dtos/LogCreateDto';
import { ILogRepository } from '../interfaces/ILogRepository';

@injectable()
export class LogRepository implements ILogRepository {
    public async GetByTaskId(taskId: number): Promise<Log[]> {
        return Log.findAll({
            where: { TaskId: taskId },
            order: [['id', 'DESC']],
        });
    }

    public async GetById(id: number): Promise<Log | null> {
        return Log.findByPk(id);
    }

    public async Add(logCreateDto: LogCreateDto, task: Task): Promise<void> {
        Log.create({
            ...logCreateDto,
            loggedAt: new Date(),
            TaskId: task.id,
            UserId: task.UserId,
        });
    }

    public async Update(
        log: Log,
        logCreateDto: LogCreateDto
    ): Promise<Log | null> {
        return log.update(logCreateDto);
    }

    public async Delete(logItem: Log) {
        logItem.destroy();
    }

    public async CompleteLatest(taskId: number): Promise<void> {
        const log = await this.GetByTaskId(taskId);
        if (log.length > 0) await log[0].update({ complete: true });
    }

    public async AddHours(log: any, hours: number): Promise<void> {
        await Log.create({
            name: log.dataValues.name,
            projectNumber: log.dataValues.projectNumber,
            hoursAvailableToWork: log.dataValues.hoursAvailableToWork,
            hoursWorked: +log.dataValues.hoursWorked + hours,
            hoursRemaining: log.dataValues.hoursRemaining - hours,
            notes: log.dataValues.notes,
            numberOfReviews: log.dataValues.numberOfReviews,
            reviewHours: log.dataValues.reviewHours,
            hoursRequiredByBim: log.dataValues.hoursRequiredByBim,
            complete: log.dataValues.complete,
            day: log.dataValues.day,
            weekOf: log.dataValues.weekOf,
            productiveHours: hours,
            loggedAt: log.dataValues.loggedAt,
            TaskId: log.dataValues.TaskId,
            UserId: log.dataValues.UserId,
            createdAt: log.dataValues.createdAt,
        });
    }
}
