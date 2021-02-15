import { Response } from 'express';
import { inject } from 'inversify';
import { Alert } from '../responseObjects/Alert';
import { Types } from '../constants/Types';
import { Logger } from '@overnightjs/logger';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { body } from 'express-validator';
import { TaskService } from '../services/TaskService';
import { ITaskRepository } from '../data/interfaces/ITaskRepository';
import { ValidationMessages } from '../constants/ValidationMessages';
import { HttpResponse } from '../constants/HttpResponse';
import { LogService } from '../services/LogService';
import { MapUserToTask } from '../middleware/MapUserToTask';
import { CalculateHoursRemaining } from '../middleware/CalculateHoursRemaining';
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
    private readonly taskRepository: ITaskRepository;
    private readonly logRepository: ILogRepository;
    private readonly taskService: TaskService;
    private readonly logService: LogService;

    public constructor(
        @inject(Types.TaskRepository) taskRepository: ITaskRepository,
        @inject(Types.LogRepository) logRepository: ILogRepository,
        @inject(Types.TaskService) taskService: TaskService,
        @inject(Types.LogService) logService: LogService
    ) {
        super();
        this.taskRepository = taskRepository;
        this.logRepository = logRepository;
        this.taskService = taskService;
        this.logService = logService;
    }

    @httpGet('/incomplete')
    private async GetIncompleteTasks(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const incompleteTasks = await this.taskRepository.GetByStatus(
                req.payload.userInfo.id,
                false
            );
            return this.ok(incompleteTasks);
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpGet('/incomplete/:id', LoggerMiddleware)
    private async GetIncompleteTask(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const task = await this.taskRepository.GetById(+req.params.id);
            if (!task) return this.notFound();

            return this.ok(task);
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpGet('/complete', LoggerMiddleware)
    private async GetCompleteTasks(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const tasks = await this.taskRepository.GetByStatus(
                req.payload.userInfo.id,
                true
            );
            return this.ok(tasks);
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpGet('/complete/:id', LoggerMiddleware)
    private async GetCompleteTask(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const task = await this.taskRepository.GetById(+req.params.id);
            if (!task) return this.notFound();

            return this.ok(task);
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpPost(
        '/',
        LoggerMiddleware,
        MapUserToTask,
        CalculateHoursRemaining,
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
            .withMessage(ValidationMessages.HOURS_BIM),
        body('dateAssigned')
            .not()
            .isEmpty()
            .withMessage(ValidationMessages.DATE_ASSGINED),
        body('dueDate').not().isEmpty().withMessage(ValidationMessages.DUE_DATE)
    )
    public async CreateTask(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        Logger.Warn(req.body, true);
        try {
            const taskFormErrorsPresent = this.taskService.ValidateForm(req);
            if (taskFormErrorsPresent)
                return this.badRequest(this.taskService.errorMessage);

            const existingTask = await this.taskRepository.GetByProjectNumber(
                req.body.projectNumber,
                req.payload.userInfo.id
            );

            if (existingTask) return this.badRequest(HttpResponse.TASK_EXISTS);
            const newTask = await this.taskRepository.Add(req.body);

            if (newTask) {
                const logCreateDto = this.logService.MapProps(req.body, null);
                await this.logRepository.Add(logCreateDto, newTask);
            }

            return this.created('/', new Alert(HttpResponse.TASK_CREATED));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpDelete('/:id', LoggerMiddleware)
    private async DeleteTask(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const task = await this.taskRepository.GetById(+req.params.id);

            if (!task)
                return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);
            await this.taskRepository.Delete(task);

            return this.ok(new Alert(HttpResponse.TASK_DELETED));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpPut('/:id', LoggerMiddleware, MapUserToTask, CalculateHoursRemaining)
    private async Update(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        Logger.Warn(req.body, true);
        try {
            const task = await this.taskRepository.GetById(+req.params.id);
            if (!task) return this.notFound();

            const previouslyWorkedHours = task.hoursWorked;
            const updatedTask = await this.taskRepository.Update(
                task,
                req.body
            );

            if (updatedTask) {
                const hoursWorked =
                    updatedTask.hoursWorked - previouslyWorkedHours;
                const logCreateDto = this.logService.MapProps(
                    req.body,
                    hoursWorked
                );
                await this.logRepository.Add(logCreateDto, task);
            }

            return this.ok(new Alert(HttpResponse.TASK_UPDATE));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpPut('/incomplete/:id', LoggerMiddleware)
    private async CompleteTask(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const task = await this.taskRepository.GetById(+req.params.id);

            if (!task)
                return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);
            await this.taskRepository.Complete(task);

            return this.ok(new Alert(HttpResponse.TASK_COMPLETE));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpPut('/complete/:id', LoggerMiddleware)
    private async InCompleteTask(
        @request() req: AuthenticatedRequest,
        @response() res: Response
    ) {
        try {
            const task = await this.taskRepository.GetById(+req.params.id);

            if (!task) return this.notFound();
            await this.taskRepository.InComplete(task);

            return this.ok(new Alert(HttpResponse.TASK_INCOMPLETE));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }
}
