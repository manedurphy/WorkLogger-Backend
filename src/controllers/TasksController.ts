import { Request, Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { TaskRepository } from '../data/repositories/TaskRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
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

  public constructor(
    @inject(Types.TaskRepository) taskRepository: TaskRepository
  ) {
    super();
    this.taskRepository = taskRepository;
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

  @httpPost('/')
  public async CreateTask(@request() req: Request, @response() res: Response) {
    try {
      await this.taskRepository.Add(req.body);
      return this.created('/', { message: 'Task created' }); // come back to this
    } catch (error) {
      return this.internalServerError();
    }
  }
}
