import { injectable } from 'inversify';
import { Task } from '../../models';
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

  public GetByProjectNumber(projectNumber: number): Task | undefined {
    return this._tasks.find((task) => task.projectNumber === projectNumber);
  }

  public async Get(userId: number, complete: boolean): Promise<void> {
    const tasks = await Task.findAll({
      where: { UserId: userId, complete },
      order: [['id', 'DESC']],
    });

    this._tasks = tasks;
  }

  public async Add(task: Task): Promise<void> {
    const newTask = await Task.create(task);
    this._task = newTask;
  }
}
