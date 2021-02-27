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
import Log from '../models/Log';
import { Op } from 'sequelize';

@controller('/api/logs', logRoute)
export class LogsController extends BaseHttpController {
    private readonly logRepository: ILogRepository;
    private readonly logService: LogService;
    private readonly taskRepository: ITaskRepository;
    private readonly taskService: TaskService;

    public constructor(
        @inject(Types.LogRepository) logRepository: ILogRepository,
        @inject(Types.LogService) logService: LogService,
        @inject(Types.TaskRepository) taskRepository: ITaskRepository,
        @inject(Types.TaskService) taskService: TaskService
    ) {
        super();
        this.logRepository = logRepository;
        this.logService = logService;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
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
            function getLocalSunday(today: Date = new Date()) {
                const sunday = new Date(today);
                sunday.setDate(sunday.getDate() - sunday.getDay());

                const sundayOffset = sunday.getTimezoneOffset() * 60000;
                return new Date(sunday.getTime() - sundayOffset).toISOString().slice(0, 10);
            }

            const lastSunday = getLocalSunday();
            console.log(lastSunday);

            const d = new Date();
            d.setDate(d.getDate() + 7 - (d.getDay() % 7) + 1);

            const nextSunday = getLocalSunday(d);

            console.log(nextSunday);

            const log = await Log.findAll({
                where: {
                    UserId: req.payload.userInfo.id,
                    loggedAt: {
                        [Op.between]: [lastSunday, nextSunday],
                    },
                },
            });

            return log;
        } catch (error) {
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }
}
