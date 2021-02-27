import { Task } from '../../models';
import { Log } from '../../models/Log';
import { LogCreateDto } from '../dtos/LogCreateDto';

export interface ILogRepository {
    getByTaskId(taskId: number): Promise<Log[]>;
    add(logCreateDto: LogCreateDto, task: Task): Promise<Log>;
    update(log: Log, logCreateDto: LogCreateDto): Promise<Log | null>;
    getById(id: number): Promise<Log | null>;
    delete(logItem: Log): Promise<void>;
    save(logItem: Log): Promise<void>;
    completeLatest(taskId: number): Promise<void>;
    getWeeklyLogs(userId: number): Promise<Log[]>;
}
