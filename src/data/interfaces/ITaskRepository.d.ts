import { Task } from '../../models/Task';

export interface ITaskRepository {
  Get(userId: number): Promise<void>;
  GetByStatus(userId: number, complete: boolean): Promise<void>;
  GetByProjectNumber(projectNumber: number): void;
  Add(task: Task): Promise<void>;
}
