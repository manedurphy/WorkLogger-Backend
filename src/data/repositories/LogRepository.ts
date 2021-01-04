import { injectable } from 'inversify';
import { Log, Task } from '../../models';
import { ILogRepository } from '../interfaces/ILogRepository';

@injectable()
export class LogRepository implements ILogRepository {
  private _log: Log[] = [];

  get log() {
    return this._log;
  }

  public async Get(projectNumber: number, userId: number): Promise<void> {
    const log = await Log.findAll({
      where: { projectNumber, UserId: userId },
      order: [['id', 'DESC']],
    });
    this._log = log;
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
