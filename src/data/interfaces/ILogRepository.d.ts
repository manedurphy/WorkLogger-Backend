import { Task } from '../../models';
import { Log } from '../../models/Log';

export interface ILogRepository {
  Get(proojectNumber: number, userId: number): Promise<void>;
  Add(log: Log, task: Task): Promise<void>;
}
