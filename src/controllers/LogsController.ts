import { Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { ILogRepository } from '../data/interfaces/ILogRepository';
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
  httpPut,
  request,
  response,
} from 'inversify-express-utils';

@controller('/api/logs')
export class LogsController extends BaseHttpController {
  private readonly logRepository: ILogRepository;
  private readonly logService: LogService;
  private readonly taskRepository: TaskRepository;

  public constructor(
    @inject(Types.LogRepository) logRepository: ILogRepository,
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

      const hoursRemoved = logItem.productiveHours;
      const task = await this.taskRepository.GetById(logItem.TaskId);
      if (!task) return this.notFound();

      await this.logRepository.Delete(logItem);

      const log = await this.logRepository.GetByTaskId(logItem.TaskId);
      const hoursWorked = await this.logService.GetHoursWorkedAfterDelete(
        log,
        hoursRemoved
      );

      task.hoursWorked = hoursWorked;
      this.taskRepository.Save(task);

      return this.statusCode(204);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }

  @httpPut('/log-item/:id')
  private async UpdateLogItem(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      const logItem = await this.logRepository.GetById(+req.params.id);
      if (!logItem) return this.notFound();

      const task = await this.taskRepository.GetById(req.body.TaskId);
      console.log('TASK: ', task);
      if (!task) return this.notFound(); // Consider an Alert

      console.log('REQ BODY BEFORE UPDATE', req.body);
      await this.logRepository.Update(logItem, req.body);

      const log = await this.logRepository.GetByTaskId(logItem.TaskId);
      console.log('LOG BEFORE GET HOURS WORKED', log);
      const hoursWorked = await this.logService.GetHoursWorkedAfterUpdate(log);

      task.hoursWorked = hoursWorked;
      this.taskRepository.Save(task);

      return this.statusCode(204);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }
}
