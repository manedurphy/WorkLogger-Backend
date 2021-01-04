import { Task } from '../../models/Task';

export interface ITaskRepository {
  Get(userId: number, complete: boolean): Promise<void>;
  GetByProjectNumber(projectNumber: number): Task | undefined;
  Add(task: Task): Promise<void>;
}
