import { Task } from '../../models';
import { Log } from '../../models/Log';
import { LogCreateDto } from '../dtos/LogCreateDto';

export interface ILogRepository {
    getByTaskId(taskId: number): Promise<Log[]>;
    Add(logCreateDto: LogCreateDto, task: Task): Promise<void>;
    Update(log: Log, logCreateDto: LogCreateDto): Promise<Log | null>;
    getById(id: number): Promise<Log | null>;
    delete(logItem: Log): Promise<void>;
    save(logItem: Log): Promise<void>;
    CompleteLatest(taskId: number): Promise<void>;
    AddHours(log: Log, hours: number): Promise<void>;
}
