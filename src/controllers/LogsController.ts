import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { AuthenticatedRequest } from './interfaces/authenticatedReq';
import { HttpResponse } from '../constants/HttpResponse';
import { Logger } from '@overnightjs/logger';
import { LogService } from '../services/LogService';
import { ITaskRepository } from '../data/interfaces/ITaskRepository';
import { Alert } from '../responseObjects/Alert';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpPut,
    request,
    requestParam,
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

    @httpDelete('/log-item/:id')
    private async deleteLogItem(@requestParam('id') id: number) {
        try {
            const logItem = await this.logRepository.getById(id);
            if (!logItem)
                return this.json(
                    new Alert(HttpResponse.LOG_ITEM_NOT_FOUND),
                    404
                );

            const task = await this.taskRepository.getById(logItem.TaskId);
            if (!task)
                return this.json(new Alert(HttpResponse.TASKS_NOT_FOUND), 404);

            const logBeforeDelete = await this.logRepository.getByTaskId(
                logItem.TaskId
            );
            if (logBeforeDelete.length === 1)
                return this.json(new Alert(HttpResponse.LOG_NO_DELETE), 400);

            this.logRepository.delete(logItem);

            const log = logBeforeDelete.filter((item) => item.id != id);
            const hours = +logItem.productiveHours;

            await this.logService.getHoursWorkedAfterDelete(log, hours);

            task.name = log[0].name;
            task.hoursWorked = log[0].hoursWorked;
            task.hoursRemaining = log[0].hoursRemaining;
            task.hoursRequiredByBim = log[0].hoursRequiredByBim;
            task.reviewHours = log[0].reviewHours;
            task.notes = log[0].notes;
            task.hoursAvailableToWork = log[0].hoursAvailableToWork;
            task.numberOfReviews = log[0].numberOfReviews;
            this.taskRepository.save(task);

            return this.ok(new Alert(HttpResponse.LOG_ITEM_DELETED));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }

    @httpPut('/log-item/:id')
    private async updateLogItem(@request() req: AuthenticatedRequest) {
        try {
            const logItem = await this.logRepository.getById(+req.params.id);
            if (!logItem)
                return this.json(
                    new Alert(HttpResponse.LOG_ITEM_NOT_FOUND),
                    404
                );

            const task = await this.taskRepository.getById(logItem.TaskId);
            if (!task)
                return this.json(new Alert(HttpResponse.TASKS_NOT_FOUND), 404);

            await this.logRepository.update(logItem, req.body);

            const log = await this.logRepository.getByTaskId(logItem.TaskId);
            const hoursWorked = await this.logService.getHoursWorkedAfterUpdate(
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

            this.taskRepository.save(task);

            return this.ok(new Alert(HttpResponse.LOG_UPDATED));
        } catch (error) {
            Logger.Err(error);
            return this.internalServerError();
        }
    }
}
