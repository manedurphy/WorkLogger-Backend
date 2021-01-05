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
      await this.logRepository.GetByTaskId(+req.params.taskId);
      if (!this.logRepository.log.length) return this.notFound();

      return this.ok(this.logRepository.log);
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
      await this.logRepository.GetById(+req.params.id);
      const logItem = this.logRepository.logItem;

      if (!logItem) return this.notFound();

      if (!this.logService.LogMatchesUser(logItem, req.payload.userInfo.id))
        return this.statusCode(401);

      return this.ok(this.logRepository.logItem);
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
      await this.logRepository.GetById(+req.params.id);
      const logItem = this.logRepository.logItem;
      const taskId = logItem?.TaskId;

      if (!logItem || !taskId) return this.notFound();

      if (!this.logService.LogMatchesUser(logItem, req.payload.userInfo.id))
        return this.statusCode(401);

      await this.logRepository.Delete(+req.params.id);
      await this.logRepository.GetByTaskId(taskId);
      await this.taskRepository.Get(req.payload.userInfo.id);

      this.taskRepository.GetById(taskId);
      const hoursWorked = await this.logService.GetHoursWorked(
        this.logRepository.log
      );

      this.taskRepository.UpdateHours(hoursWorked);

      return this.statusCode(204);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }
}
