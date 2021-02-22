import Task from '../../models/Task';
import Log from '../../models/Log';
import { injectable } from 'inversify';
import { TaskCreateDto } from '../dtos/TaskCreateDto';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class TaskRepository implements ITaskRepository {
    public async getById(id: number): Promise<Task | null> {
        return Task.findByPk(id, {
            include: { model: Log, separate: true, order: [['id', 'DESC']] },
        });
    }

    public async getIncomplete(userId: number): Promise<Task[]> {
        return Task.findAll({
            where: { UserId: userId, complete: false },
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

    public async getComplete(userId: number): Promise<Task[]> {
        return Task.findAll({
            where: { UserId: userId, complete: true },
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

    public getByProjectNumber(
        projectNumber: number,
        userId: number
    ): Promise<Task | null> {
        return Task.findOne({ where: { projectNumber, UserId: userId } });
    }

    public async add(taskCreateDto: TaskCreateDto): Promise<Task | null> {
        return Task.create(taskCreateDto);
    }

    public async delete(task: Task): Promise<void> {
        return task.destroy();
    }

    public async update(
        task: Task,
        updatedTask: TaskCreateDto
    ): Promise<Task | null> {
        return task.update(updatedTask);
    }

    public async complete(task: Task): Promise<void> {
        await task.update({ complete: true });
    }

    public async InComplete(task: Task): Promise<void> {
        await task.update({ complete: false });
    }

    public async save(task: Task) {
        await task.save();
    }

    public async addHours(task: Task, hours: number): Promise<void> {
        await task.update({
            hoursWorked: +task.hoursWorked + hours,
            hoursRemaining: +task.hoursRemaining - hours,
        });
    }
}
