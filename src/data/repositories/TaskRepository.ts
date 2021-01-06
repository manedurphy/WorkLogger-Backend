import { injectable } from 'inversify';
import { Task } from '../../models';
import { TaskCreateDto } from '../dtos/TaskCreateDto';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class TaskRepository implements ITaskRepository {
  private _tasks: Task[] = [];
  private _task: Task | null = null;

  get tasks() {
    return this._tasks;
  }

  get task() {
    return this._task;
  }

  public async Get(userId: number): Promise<void> {
    const tasks = await Task.findAll({ where: { UserId: userId } });
    this._tasks = tasks;
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

  public async GetByStatus(userId: number, complete: boolean): Promise<Task[]> {
    return Task.findAll({
      where: { UserId: userId, complete },
      order: [['id', 'DESC']],
    });
  }

  public async Add(taskCreateDto: TaskCreateDto): Promise<Task | null> {
    return Task.create(taskCreateDto);
  }

  public async Delete(task: Task): Promise<void> {
    task.destroy();
  }

  public async Update(
    task: Task,
    updatedTask: TaskCreateDto
  ): Promise<Task | null> {
    return task.update(updatedTask);
  }

  public async UpdateHours(hoursWorked: number): Promise<void> {
    this._task?.update({ hoursWorked });
  }

  public async Complete(task: Task): Promise<void> {
    task.update({ complete: true });
  }

  public async InComplete(task: Task): Promise<void> {
    task.update({ complete: false });
  }
}
