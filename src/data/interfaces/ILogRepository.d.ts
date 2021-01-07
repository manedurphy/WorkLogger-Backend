import { Task } from '../../models';
import { Log } from '../../models/Log';
import { LogCreateDto } from '../dtos/LogCreateDto';

export interface ILogRepository {
  GetByTaskId(taskId: number): Promise<Log[]>;
  Add(logCreateDto: LogCreateDto, task: Task): Promise<void>;
  Update(log: Log, logCreateDto: LogCreateDto): Promise<Log | null>;
  GetById(id: number): Promise<Log | null>;
  Delete(logItem: Log): Promise<void>;
}
