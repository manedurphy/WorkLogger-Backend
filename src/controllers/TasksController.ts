import { inject } from 'inversify';
import { Alert } from '../responseObjects/Alert';
import { Types } from '../constants/Types';
import { Logger } from '@overnightjs/logger';
import { AuthenticatedRequest } from './interfaces/authenticatedReq';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { logRoute } from '../middleware/logRoute';
import { body } from 'express-validator';
import { TaskService } from '../services/TaskService';
import { ITaskRepository } from '../data/interfaces/ITaskRepository';
import { ValidationMessages } from '../constants/ValidationMessages';
import { HttpResponse } from '../constants/HttpResponse';
import { LogService } from '../services/LogService';
import { mapUserToTask } from '../middleware/MapUserToTask';
import { calculateHoursRemaining } from '../middleware/CalculateHoursRemaining';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost,
    httpPut,
    request,
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

    @httpGet('/incomplete', logRoute)
    private async getIncompleteTasks(@request() req: AuthenticatedRequest) {
        try {
            const { id } = req.payload.userInfo;
            const incompleteTasks = await this.taskRepository.getIncomplete(id);
            return this.ok(incompleteTasks);
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpGet('/complete', logRoute)
    private async getCompleteTasks(@request() req: AuthenticatedRequest) {
        try {
            const { id } = req.payload.userInfo;
            const tasks = await this.taskRepository.getComplete(id);
            return this.ok(tasks);
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpGet('/:id', logRoute)
    private async getById(@request() req: AuthenticatedRequest) {
        try {
            const task = await this.taskRepository.getById(+req.params.id);
            if (!task) return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);

            return this.ok(task);
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpPost(
        '/',
        logRoute,
        mapUserToTask,
        calculateHoursRemaining,
        body('name').not().isEmpty().withMessage(ValidationMessages.TASK_NAME),
        body('projectNumber').not().isEmpty().withMessage(ValidationMessages.PROJECT_NUMBER),
        body('hoursAvailableToWork').not().isEmpty().withMessage(ValidationMessages.AVAILABLE_HOURS),
        body('hoursWorked').not().isEmpty().withMessage(ValidationMessages.HOURS_WORKED),
        body('reviewHours').not().isEmpty().withMessage(ValidationMessages.REVIEW_HOURS),
        body('numberOfReviews').not().isEmpty().withMessage(ValidationMessages.NUMBER_OF_REVIEWS),
        body('hoursRequiredByBim').not().isEmpty().withMessage(ValidationMessages.HOURS_BIM),
        body('dateAssigned').not().isEmpty().withMessage(ValidationMessages.DATE_ASSGINED),
        body('dueDate').not().isEmpty().withMessage(ValidationMessages.DUE_DATE)
    )
    private async createTask(@request() req: AuthenticatedRequest) {
        try {
            const taskFormErrorsPresent = this.taskService.validateForm(req);
            if (taskFormErrorsPresent) return this.json(new Alert(this.taskService.errorMessage), 400);

            const { projectNumber } = req.body;
            const { id } = req.payload.userInfo;

            const existingTask = await this.taskRepository.getByProjectNumber(projectNumber, id);

            if (existingTask) return this.json(new Alert(HttpResponse.TASK_EXISTS), 400);

            const newTask = await this.taskRepository.add(req.body);

            if (newTask) {
                const logCreateDto = this.logService.getCreateDto(req.body);
                await this.logRepository.add(logCreateDto, newTask);
            }

            return this.json(new Alert(HttpResponse.TASK_CREATED), 201);
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpDelete('/:id', logRoute)
    private async deleteTask(@request() req: AuthenticatedRequest) {
        try {
            const task = await this.taskRepository.getById(+req.params.id);

            if (!task) return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);

            await this.taskRepository.delete(task);
            return this.ok(new Alert(HttpResponse.TASK_DELETED));
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpPut('/:id', logRoute, mapUserToTask, calculateHoursRemaining)
    private async update(@request() req: AuthenticatedRequest) {
        try {
            const task = await this.taskRepository.getById(+req.params.id);
            if (!task) return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);

            const updatedTask = await this.taskRepository.update(task, req.body);

            if (updatedTask) {
                const productivity = updatedTask.hoursWorked - task.hoursWorked;
                const logCreateDto = this.logService.getCreateDto(req.body, productivity);
                await this.logRepository.add(logCreateDto, task);
            }

            return this.ok(new Alert(HttpResponse.TASK_UPDATE));
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpPut('/incomplete/:id', logRoute)
    private async completeTask(@request() req: AuthenticatedRequest) {
        try {
            const task = await this.taskRepository.getById(+req.params.id);

            if (!task) return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);

            await this.taskRepository.complete(task);
            await this.logRepository.completeLatest(task.id);

            return this.ok(new Alert(HttpResponse.TASK_COMPLETE));
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpPatch('/add-hours/:id', logRoute, calculateHoursRemaining)
    private async addHours(@request() req: AuthenticatedRequest) {
        try {
            const task = await this.taskRepository.getById(req.params.id);

            if (!task) return this.json(new Alert(HttpResponse.TASK_NOT_FOUND), 404);

            const log = await this.logRepository.getByTaskId(task.id);

            await this.taskRepository.addHours(task, +req.body.hours);
            if (log[0]) await this.logRepository.addHours(log[0], +req.body.hours);

            return this.ok(new Alert(HttpResponse.TASK_UPDATE));
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }
}
