import { injectable } from 'inversify';
import { Task } from '../../models';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class TaskRepository implements ITaskRepository {
  private _tasks: Task[] = [];

  get tasks() {
    return this._tasks;
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
    Task.create(task);
  }
}
