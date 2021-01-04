import { injectable } from 'inversify';
import { Log, Task } from '../../models';
import { LogCreateDto } from '../dtos/LogCreateDto';
import { ILogRepository } from '../interfaces/ILogRepository';

@injectable()
export class LogRepository implements ILogRepository {
  private _log: Log[] = [];
  private _logItem: Log | null = null;

  get log() {
    return this._log;
  }

  get logItem() {
    return this._logItem;
  }

  public async GetByTaskId(taskId: number): Promise<void> {
    const log = await Log.findAll({
      where: { TaskId: taskId },
      order: [['id', 'DESC']],
    });
    this._log = log;
  }

  public async GetById(id: number) {
    const logItem = await Log.findByPk(id);
    console.log(logItem);
    this._logItem = logItem || null;
  }

  public async Add(logCreateDto: LogCreateDto, task: Task): Promise<void> {
    Log.create({
      ...logCreateDto,
      loggedAt: new Date(),
      TaskId: task.id,
      UserId: task.UserId,
    });
  }

  public async Update(log: Log) {
    const updatedLog = await this._logItem?.update(log);
    this._logItem = updatedLog || null;
  }

  public async Delete(id: number) {
    await this._logItem?.destroy();
    this._logItem = null;
  }
}
