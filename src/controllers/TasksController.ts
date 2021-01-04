import { Request, Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { TaskRepository } from '../data/repositories/TaskRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { LogRepository } from '../data/repositories/LogRepository';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';

@controller('/api/tasks')
export class TasksController extends BaseHttpController {
  private readonly taskRepository: TaskRepository;
  private readonly logRepository: LogRepository;

  public constructor(
    @inject(Types.TaskRepository) taskRepository: TaskRepository,
    @inject(Types.LogRepository) logRepository: LogRepository
  ) {
    super();
    this.taskRepository = taskRepository;
    this.logRepository = logRepository;
  }

  @httpGet('/')
  public async GetIncompleteTasks(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.Get(req.payload.userInfo.id, false);
      return this.ok(this.taskRepository.tasks);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpGet('/incomplete/:projectNumber')
  private async GetIncompleteTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.Get(req.payload.userInfo.id, false);
      const task = this.taskRepository.GetByProjectNumber(
        req.params.projectNumber
      );

      return this.ok(task);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpPost('/')
  public async CreateTask(@request() req: Request, @response() res: Response) {
    try {
      await this.taskRepository.Add(req.body);
      const task = this.taskRepository.task;

      if (task) await this.logRepository.Add(req.body, task);

      return this.created('/', { message: 'Task created' }); // come back to this
    } catch (error) {
      return this.internalServerError();
    }
  }
}
