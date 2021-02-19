import Task from '../../models/Task';
import Log from '../../models/Log';
import { injectable } from 'inversify';
import { TaskCreateDto } from '../dtos/TaskCreateDto';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class TaskRepository implements ITaskRepository {
    public async Get(userId: number): Promise<Task[]> {
        return Task.findAll({ where: { UserId: userId } });
    }

    public async GetById(id: number): Promise<Task | null> {
        return Task.findByPk(id);
    }

    public GetByProjectNumber(
        projectNumber: number,
        userId: number
    ): Promise<Task | null> {
        return Task.findOne({ where: { projectNumber, UserId: userId } });
    }

    public async GetByStatus(
        userId: number,
        complete: boolean
    ): Promise<Task[]> {
        return Task.findAll({
            where: { UserId: userId, complete },
            order: [['id', 'DESC']],
            include: [
                {
                    model: Log,
                    separate: true,
                    order: [['id', 'DESC']],
                },
            ],
        });
    }

    public async Add(taskCreateDto: TaskCreateDto): Promise<Task | null> {
        return Task.create(taskCreateDto);
    }

    public async Delete(task: Task): Promise<void> {
        return task.destroy();
    }

    public async Update(
        task: Task,
        updatedTask: TaskCreateDto
    ): Promise<Task | null> {
        return task.update(updatedTask);
    }

    public async Complete(task: Task): Promise<void> {
        await task.update({ complete: true });
    }

    public async InComplete(task: Task): Promise<void> {
        await task.update({ complete: false });
    }

    public async Save(task: Task) {
        await task.save();
    }

    public async AddHours(task: Task, hours: number): Promise<void> {
        await task.update({ hoursWorked: task.hoursWorked + hours });
    }
}
