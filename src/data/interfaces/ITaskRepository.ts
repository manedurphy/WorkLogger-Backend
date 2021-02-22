import { Task } from '../../models/Task';
import { TaskCreateDto } from '../dtos/TaskCreateDto';

export interface ITaskRepository {
    getIncomplete(userId: number): Promise<Task[]>;
    GetByStatus(userId: number, complete: boolean): Promise<Task[]>;
    getById(id: number): Promise<Task | null>;
    GetByProjectNumber(
        projectNumber: number,
        userId: number
    ): Promise<Task | null>;
    Add(taskCreateDto: TaskCreateDto): Promise<Task | null>;
    Delete(task: Task): Promise<void>;
    Update(task: Task, updatedTask: TaskCreateDto): Promise<Task | null>;
    Complete(task: Task): Promise<void>;
    InComplete(task: Task): Promise<void>;
    save(task: Task): Promise<void>;
    AddHours(task: Task, hours: number): Promise<void>;
}
