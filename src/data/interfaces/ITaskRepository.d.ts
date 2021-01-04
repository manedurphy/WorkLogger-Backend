import { Task } from '../../models/Task';

export interface ITaskRepository {
  Get(userId: number): Promise<void>;
  GetByStatus(userId: number, complete: boolean): Promise<void>;
  GetById(id: number): void;
  GetByProjectNumber(projectNumber: number): void;
  Add(task: Task): Promise<void>;
  Delete(): Promise<void>;
  Update(updatedTask: Task): Promise<void>;
  Complete(): Promise<void>;
  InComplete(): Promise<void>;
}
