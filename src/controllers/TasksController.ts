import { Request, Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { TaskRepository } from '../data/repositories/TaskRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { LogRepository } from '../data/repositories/LogRepository';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { body } from 'express-validator';
import { TaskService } from '../services/TaskService';
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
  private readonly taskService: TaskService;

  public constructor(
    @inject(Types.TaskRepository) taskRepository: TaskRepository,
    @inject(Types.LogRepository) logRepository: LogRepository,
    @inject(Types.TaskService) taskService: TaskService
  ) {
    super();
    this.taskRepository = taskRepository;
    this.logRepository = logRepository;
    this.taskService = taskService;
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

  @httpGet('/incomplete/:projectNumber', LoggerMiddleware)
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

  @httpPost(
    '/',
    LoggerMiddleware,
    body('name').not().isEmpty().withMessage('Task name is missing'),
    body('projectNumber')
      .not()
      .isEmpty()
      .withMessage('Project number is missing'),
    body('hoursAvailableToWork')
      .not()
      .isEmpty()
      .withMessage('Please enter available hours'),
    body('hoursWorked')
      .not()
      .isEmpty()
      .withMessage('Please enter the numbers of hours worked'),
    body('reviewHours')
      .not()
      .isEmpty()
      .withMessage('Please enter the number of review hours'),
    body('numberOfReviews')
      .not()
      .isEmpty()
      .withMessage('Number of reviews is missing'),
    body('hoursRequiredByBim')
      .not()
      .isEmpty()
      .withMessage('Hours required by BIM is missing')
  )
  public async CreateTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      const taskFormErrorsPresent = this.taskService.Validate(req);

      if (taskFormErrorsPresent)
        return this.badRequest(this.taskService.errorMessage);

      await this.taskRepository.Add(req.body);
      const task = this.taskRepository.task;

      if (task) await this.logRepository.Add(req.body, task);

      return this.created('/', { message: 'Task created' }); // come back to this
    } catch (error) {
      return this.internalServerError();
    }
  }
}

// "reviewHours": 4,
