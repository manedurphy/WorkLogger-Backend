import { Task } from '../../models/Task';

export interface ITaskRepository {
  Get(userId: number, complete: boolean): Promise<void>;
  GetById(id: number): Promise<Task | null>;
  Add(task: Task): Promise<void>;
}
