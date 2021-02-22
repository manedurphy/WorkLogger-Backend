import { Task } from '../../models/Task';
import { TaskCreateDto } from '../dtos/TaskCreateDto';

export interface ITaskRepository {
    getIncomplete(userId: number): Promise<Task[]>;
    getComplete(userId: number): Promise<Task[]>;
    getById(id: number): Promise<Task | null>;
    getByProjectNumber(
        projectNumber: number,
        userId: number
    ): Promise<Task | null>;
    add(taskCreateDto: TaskCreateDto): Promise<Task | null>;
    delete(task: Task): Promise<void>;
    update(task: Task, updatedTask: TaskCreateDto): Promise<Task | null>;
    complete(task: Task): Promise<void>;
    InComplete(task: Task): Promise<void>;
    save(task: Task): Promise<void>;
    addHours(task: Task, hours: number): Promise<void>;
}
