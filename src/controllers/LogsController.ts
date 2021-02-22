import { Response } from 'express';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { AuthenticatedRequest } from './interfaces/interfaces';
import { HttpResponse } from '../constants/HttpResponse';
import { Logger } from '@overnightjs/logger';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { LogService } from '../services/LogService';
import { ITaskRepository } from '../data/interfaces/ITaskRepository';
import { Alert } from '../responseObjects/Alert';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPut,
    request,
    requestParam,
    response,
} from 'inversify-express-utils';

@controller('/api/logs')
export class LogsController extends BaseHttpController {
    private readonly logRepository: ILogRepository;
    private readonly logService: LogService;
    private readonly taskRepository: ITaskRepository;

    public constructor(
        @inject(Types.LogRepository) logRepository: ILogRepository,
        @inject(Types.LogService) logService: LogService,
        @inject(Types.TaskRepository) taskRepository: ITaskRepository
    ) {
        super();
        this.logRepository = logRepository;
        this.logService = logService;
        this.taskRepository = taskRepository;
    }

    @httpGet('/log-item/:id')
    private async GetLogItemById(@requestParam('id') id: number) {
        try {
            const logItem = await this.logRepository.GetById(+id);
            if (!logItem)
                return this.json(
                    new Alert(HttpResponse.LOG_ITEM_NOT_FOUND),
                    404
                );

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
            if (!logItem)
                if (!logItem)
                    return this.json(
                        new Alert(HttpResponse.LOG_ITEM_NOT_FOUND),
                        404
                    );

            const task = await this.taskRepository.GetById(logItem.TaskId);
            if (!task) return this.notFound();

            const logBeforeDelete = await this.logRepository.getByTaskId(
                logItem.TaskId
            );
            if (logBeforeDelete.length === 1)
                return this.json(new Alert(HttpResponse.LOG_NO_DELETE), 400);

            await this.logRepository.Delete(logItem);

            const log = await this.logRepository.getByTaskId(logItem.TaskId);

            const hoursWorked = await this.logService.GetHoursWorkedAfterDelete(
                log,
                logItem
            );

            task.hoursWorked = hoursWorked;
            task.hoursRemaining = log[0].hoursRemaining;
            this.taskRepository.Save(task);

            return this.ok(new Alert(HttpResponse.LOG_ITEM_DELETED));
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

            const task = await this.taskRepository.GetById(logItem.TaskId);
            if (!task) return this.notFound();

            await this.logRepository.Update(logItem, req.body);

            const log = await this.logRepository.getByTaskId(logItem.TaskId);
            const hoursWorked = await this.logService.GetHoursWorkedAfterUpdate(
                log
            );

            task.name = log[0].name;
            task.hoursWorked = hoursWorked;
            task.hoursRemaining = log[0].hoursRemaining;
            task.hoursRequiredByBim = log[0].hoursRequiredByBim;
            task.reviewHours = log[0].reviewHours;
            task.notes = log[0].notes;
            task.hoursAvailableToWork = log[0].hoursAvailableToWork;
            task.numberOfReviews = log[0].numberOfReviews;

            this.taskRepository.Save(task);

            return this.ok(new Alert(HttpResponse.LOG_UPDATED));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }
}
