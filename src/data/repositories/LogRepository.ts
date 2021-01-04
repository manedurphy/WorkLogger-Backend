import { injectable } from 'inversify';
import { Log, Task } from '../../models';
import { LogCreateDto } from '../dtos/LogCreateDto';
import { ILogRepository } from '../interfaces/ILogRepository';

@injectable()
export class LogRepository implements ILogRepository {
  private _log: Log[] = [];

  get log() {
    return this._log;
  }

  public async GetByTaskId(taskId: number): Promise<void> {
    const log = await Log.findAll({
      where: { TaskId: taskId },
      order: [['id', 'DESC']],
    });
    this._log = log;
  }

  public async Add(logCreateDto: LogCreateDto, task: Task): Promise<void> {
    Log.create({
      ...logCreateDto,
      loggedAt: new Date(),
      TaskId: task.id,
      UserId: task.UserId,
    });
  }
}
