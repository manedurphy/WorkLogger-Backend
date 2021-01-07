import { injectable } from 'inversify';
import { Log, Task } from '../../models';
import { LogCreateDto } from '../dtos/LogCreateDto';
import { ILogRepository } from '../interfaces/ILogRepository';

@injectable()
export class LogRepository implements ILogRepository {
  public async GetByTaskId(taskId: number): Promise<Log[]> {
    return Log.findAll({
      where: { TaskId: taskId },
      order: [['id', 'DESC']],
    });
  }

  public async GetById(id: number): Promise<Log | null> {
    return Log.findByPk(id);
  }

  public async Add(logCreateDto: LogCreateDto, task: Task): Promise<void> {
    Log.create({
      ...logCreateDto,
      loggedAt: new Date(),
      TaskId: task.id,
      UserId: task.UserId,
    });
  }

  public async Update(log: Log, logCreateDto: LogCreateDto): Promise<void> {
    await log.update(logCreateDto); // change to return
  }

  public async Delete(logItem: Log) {
    logItem.destroy();
  }
}
