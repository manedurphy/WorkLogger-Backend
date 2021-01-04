import { Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { TaskRepository } from '../data/repositories/TaskRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { LogRepository } from '../data/repositories/LogRepository';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { body } from 'express-validator';
import { TaskService } from '../services/TaskService';
import { ValidationMessages } from '../constants/ValidationMessages';
import { HttpResponse } from '../constants/HttpResponse';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
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

  @httpGet('/incomplete')
  private async GetIncompleteTasks(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.GetByStatus(req.payload.userInfo.id, false);
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
      await this.taskRepository.GetByStatus(req.payload.userInfo.id, false);
      this.taskRepository.GetByProjectNumber(+req.params.projectNumber);

      if (!this.taskRepository.task) return this.notFound();

      return this.ok(this.taskRepository.task);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpGet('/complete')
  private async GetCompleteTasks(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.GetByStatus(req.payload.userInfo.id, true);
      return this.ok(this.taskRepository.tasks);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpGet('/complete/:projectNumber', LoggerMiddleware)
  private async GetCompleteTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.GetByStatus(req.payload.userInfo.id, true);
      this.taskRepository.GetByProjectNumber(+req.params.projectNumber);

      if (!this.taskRepository.task) return this.notFound();

      return this.ok(this.taskRepository.task);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpPost(
    '/',
    LoggerMiddleware,
    body('name').not().isEmpty().withMessage(ValidationMessages.TASK_NAME),
    body('projectNumber')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.PROJECT_NUMBER),
    body('hoursAvailableToWork')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.AVAILABLE_HOURS),
    body('hoursWorked')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.HOURS_WORKED),
    body('reviewHours')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.REVIEW_HOURS),
    body('numberOfReviews')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.NUMBER_OF_REVIEWS),
    body('hoursRequiredByBim')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.HOURS_BIM)
  )
  public async CreateTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    // May need to verify userId --> userRepository DI
    try {
      const taskFormErrorsPresent = this.taskService.ValidateForm(req);

      if (taskFormErrorsPresent)
        return this.badRequest(this.taskService.errorMessage);

      await this.taskRepository.Get(req.payload.userInfo.id);
      this.taskRepository.GetByProjectNumber(req.body.projectNumber);

      if (this.taskRepository.task)
        return this.badRequest(HttpResponse.TASK_EXISTS);

      await this.taskRepository.Add(req.body);
      const task = this.taskRepository.task;

      if (task) await this.logRepository.Add(req.body, task);

      return this.created('/', { message: 'Task created' }); // come back to this
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpDelete('/:projectNumber', LoggerMiddleware)
  private async DeleteTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.Get(req.payload.userInfo.id);
      this.taskRepository.GetByProjectNumber(+req.params.projectNumber);

      if (!this.taskRepository.task) return this.notFound();
      await this.taskRepository.Delete();

      return this.statusCode(204);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpPut('/:projectNumber', LoggerMiddleware)
  private async Update(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.Get(req.payload.userInfo.id);
      this.taskRepository.GetByProjectNumber(+req.params.projectNumber);

      if (!this.taskRepository.task) return this.notFound();
      await this.taskRepository.Update(req.body);

      return this.ok(HttpResponse.TASK_UPDATE);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpPut('/incomplete/:projectNumber', LoggerMiddleware)
  private async CompleteTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.GetByStatus(req.payload.userInfo.id, false);
      this.taskRepository.GetByProjectNumber(+req.params.projectNumber);

      if (!this.taskRepository.task) return this.notFound();
      await this.taskRepository.Complete();

      return this.ok(HttpResponse.TASK_UPDATE);
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpPut('/complete/:projectNumber', LoggerMiddleware)
  private async InCompleteTask(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      await this.taskRepository.GetByStatus(req.payload.userInfo.id, true);
      this.taskRepository.GetByProjectNumber(+req.params.projectNumber);

      if (!this.taskRepository.task) return this.notFound();
      await this.taskRepository.InComplete();

      return this.ok(HttpResponse.TASK_UPDATE);
    } catch (error) {
      return this.internalServerError();
    }
  }
}
