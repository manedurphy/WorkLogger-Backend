import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import { Types } from '../../constants/Types';
import { Log, Task } from '../../models';
import { DateService } from '../../services/DateService';
import { LogCreateDto } from '../dtos/LogCreateDto';
import { ILogRepository } from '../interfaces/ILogRepository';
import { fn, col } from 'sequelize';
import { PreShapeData, WeeklyData } from '../../services/types';

@injectable()
export class LogRepository implements ILogRepository {
    private readonly dateService: DateService;

    public constructor(@inject(Types.DateService) dateService: DateService) {
        this.dateService = dateService;
    }

    public async getByTaskId(taskId: number): Promise<Log[]> {
        return Log.findAll({
            where: { TaskId: taskId },
            order: [['id', 'DESC']],
        });
    }

    public async getById(id: number): Promise<Log | null> {
        return Log.findByPk(id);
    }

    public async getWeeklyLogs(userId: number): Promise<WeeklyData> {
        const log = (await Log.findAll({
            raw: true,
            where: {
                UserId: userId,
                loggedAt: {
                    [Op.between]: [this.dateService.lastSunday, this.dateService.nextSunday],
                },
            },
            attributes: [
                'projectNumber',
                [fn('sum', col('productiveHours')), 'hours'],
                [fn('dayofweek', col('loggedAt')), 'day'],
            ],
            group: ['projectNumber', 'day'],
        })) as unknown;

        return this.dateService.shapeWeeklyLogData(log as PreShapeData[]);
    }

    public async add(logCreateDto: LogCreateDto, task: Task): Promise<Log> {
        const date = new Date();

        return Log.create({
            ...logCreateDto,
            loggedAt: date,
            TaskId: task.id,
            UserId: task.UserId,
        });
    }

    public async update(log: Log, logCreateDto: LogCreateDto): Promise<Log | null> {
        return log.update(logCreateDto);
    }

    public async delete(logItem: Log): Promise<void> {
        await logItem.destroy();
    }

    public async save(logItem: Log): Promise<void> {
        await logItem.save();
    }

    public async completeLatest(taskId: number): Promise<void> {
        const log = await this.getByTaskId(taskId);
        if (log.length > 0) await log[0].update({ complete: true });
    }
}
