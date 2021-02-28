import { DateService } from '../services/DateService';
import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { ILogRepository } from '../data/interfaces/ILogRepository';
import { AuthenticatedRequest } from './interfaces/authenticatedReq';
import { HttpResponse } from '../constants/HttpResponse';
import { Logger } from '@overnightjs/logger';
import { LogService } from '../services/LogService';
import { ITaskRepository } from '../data/interfaces/ITaskRepository';
import { Alert } from '../responseObjects/Alert';
import { TaskService } from '../services/TaskService';
import { logRoute } from '../middleware/logRoute';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPut,
    request,
    requestParam,
} from 'inversify-express-utils';

@controller('/api/logs', logRoute)
export class LogsController extends BaseHttpController {
    private readonly logRepository: ILogRepository;
    private readonly logService: LogService;
    private readonly taskRepository: ITaskRepository;
    private readonly taskService: TaskService;
    private readonly dateService: DateService;

    public constructor(
        @inject(Types.LogRepository) logRepository: ILogRepository,
        @inject(Types.LogService) logService: LogService,
        @inject(Types.TaskRepository) taskRepository: ITaskRepository,
        @inject(Types.TaskService) taskService: TaskService,
        @inject(Types.DateService) datekService: DateService
    ) {
        super();
        this.logRepository = logRepository;
        this.logService = logService;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
        this.dateService = datekService;
    }

    @httpDelete('/log-item/:id', logRoute)
    private async deleteLogItem(@requestParam('id') id: number) {
        try {
            const logItem = await this.logRepository.getById(id);
            if (!logItem) return this.json(new Alert(HttpResponse.LOG_ITEM_NOT_FOUND), 404);

            const task = await this.taskRepository.getById(logItem.TaskId);
            if (!task) return this.json(new Alert(HttpResponse.TASKS_NOT_FOUND), 404);

            const logBeforeDelete = await this.logRepository.getByTaskId(logItem.TaskId);
            if (logBeforeDelete.length === 1) return this.json(new Alert(HttpResponse.LOG_NO_DELETE), 400);

            this.logRepository.delete(logItem);

            const log = logBeforeDelete.filter((item) => item.id != id);
            const hours = +logItem.productiveHours;

            await this.logService.updateHoursAfterDelete(log, hours);

            this.taskService.matchLatestLog(task, log[0]);
            this.taskRepository.save(task);

            return this.ok(new Alert(HttpResponse.LOG_ITEM_DELETED));
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpPut('/log-item/:id', logRoute)
    private async updateLogItem(@request() req: AuthenticatedRequest) {
        try {
            const logItem = await this.logRepository.getById(+req.params.id);
            if (!logItem) return this.json(new Alert(HttpResponse.LOG_ITEM_NOT_FOUND), 404);

            const task = await this.taskRepository.getById(logItem.TaskId);
            if (!task) return this.json(new Alert(HttpResponse.TASKS_NOT_FOUND), 404);

            await this.logRepository.update(logItem, req.body);
            const log = await this.logRepository.getByTaskId(logItem.TaskId);

            this.logService.updateHours(log);
            this.taskService.matchLatestLog(task, log[0]);
            this.taskRepository.save(task);

            return this.ok(new Alert(HttpResponse.LOG_UPDATED));
        } catch (error) {
            Logger.Err(error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpGet('/dates')
    private async getWeeklyReport(@request() req: AuthenticatedRequest) {
        try {
            const log = await this.logRepository.getWeeklyLogs(req.payload.userInfo.id);
            if (log.length === 0) return this.json(new Alert(HttpResponse.LOG_WEEKLY_NOT_FOUND), 404);

            return this.ok(log);
        } catch (error) {
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }
}
