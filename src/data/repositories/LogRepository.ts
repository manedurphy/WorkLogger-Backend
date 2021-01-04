import { injectable } from 'inversify';
import { Log, Task } from '../../models';
import { ILogRepository } from '../interfaces/ILogRepository';

@injectable()
export class LogRepository implements ILogRepository {
  private _logs: Log[] = [];

  get logs() {
    return this._logs;
  }

  public async Get(taskId: number): Promise<void> {
    const logs = await Log.findAll({
      where: { TaskId: taskId },
      order: [['id', 'DESC']],
    });
    this._logs = logs;
  }

  public async Add(log: Log, task: Task): Promise<void> {
    Log.create({
      ...log,
      loggedAt: log.loggedAt || new Date(),
      TaskId: task.id,
      UserId: task.UserId,
    });
  }
}
