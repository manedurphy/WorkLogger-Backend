import { Task } from '../../models';
import { Log } from '../../models/Log';

export interface ILogRepository {
  GetByTaskId(taskId: number): Promise<Log[]>;
  Add(log: Log, task: Task): Promise<void>;
  Update(log: Log): Promise<void>;
  GetById(id: number): Promise<Log | null>;
  Delete(logItem: Log): Promise<void>;
}
