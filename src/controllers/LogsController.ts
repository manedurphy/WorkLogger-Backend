import { Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { LogRepository } from '../data/repositories/LogRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { Logger } from '@overnightjs/logger';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { LogService } from '../services/LogService';
import { TaskRepository } from '../data/repositories/TaskRepository';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  request,
  response,
} from 'inversify-express-utils';

@controller('/api/logs')
export class LogsController extends BaseHttpController {
  private readonly logRepository: LogRepository; // see if this can be replaced with ILogRepository
  private readonly logService: LogService;
  private readonly taskRepository: TaskRepository;

  public constructor(
    @inject(Types.LogRepository) logRepository: LogRepository,
    @inject(Types.LogService) logService: LogService,
    @inject(Types.TaskRepository) taskRepository: TaskRepository
  ) {
    super();
    this.logRepository = logRepository;
    this.logService = logService;
    this.taskRepository = taskRepository;
  }

  @httpGet('/:taskId', LoggerMiddleware)
  private async GetByTaskId(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      const log = await this.logRepository.GetByTaskId(+req.params.taskId);
      if (!log.length) return this.notFound();

      return this.ok(log);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }

  @httpGet('/log-item/:id')
  private async GetLogItemById(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      const logItem = await this.logRepository.GetById(+req.params.id);
      if (!logItem) return this.notFound();

      if (!this.logService.LogMatchesUser(logItem, req.payload.userInfo.id))
        // May not be necessary
        return this.statusCode(401);

      return this.ok(logItem);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }

  @httpDelete('/log-item/:id')
  private async DeleteLogItem(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      const logItem = await this.logRepository.GetById(+req.params.id);
      if (!logItem) return this.notFound();

      // const taskId = logItem?.TaskId;
      if (!this.logService.LogMatchesUser(logItem, req.payload.userInfo.id))
        return this.statusCode(401); // May not be necessary

      // await this.logRepository.Delete(+req.params.id);
      const task = await this.taskRepository.GetById(logItem.TaskId);
      if (!task) return this.badRequest(); // new Alert something

      await this.logRepository.Delete(logItem);
      // await this.logRepository.GetByTaskId(taskId);
      const log = await this.logRepository.GetByTaskId(logItem.TaskId);
      // await this.taskRepository.Get(req.payload.userInfo.id);

      // const task = await this.taskRepository.GetById(logItem.TaskId);
      const hoursWorked = await this.logService.GetHoursWorked(log);
      task.hoursWorked = hoursWorked;

      console.log(hoursWorked);

      this.taskRepository.Save(task);

      return this.statusCode(204);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }
}
