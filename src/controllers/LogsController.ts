import { Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { LogRepository } from '../data/repositories/LogRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { Logger } from '@overnightjs/logger';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import {
  BaseHttpController,
  controller,
  httpGet,
  request,
  response,
} from 'inversify-express-utils';

@controller('/api/logs')
export class LogsController extends BaseHttpController {
  private readonly logRepository: LogRepository; // see if this can be replaced with ILogRepository

  public constructor(
    @inject(Types.LogRepository) logRepository: LogRepository
  ) {
    super();
    this.logRepository = logRepository;
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
      Logger.Warn(error);
      return this.internalServerError();
    }
  }
}
