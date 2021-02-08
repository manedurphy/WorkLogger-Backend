import './data/SQLDatabase';
import './controllers';
import './models/Relationships';
import * as express from 'express';
import cors from 'cors';
import jwtMiddleware from 'express-jwt';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { UserRepository } from './data/repositories/UserRepository';
import { Types } from './constants/Types';
import { UserService } from './services/UserService';
import { AuthService } from './services/AuthService';
import { ActivationPasswordRepository } from './data/repositories/ActivationPasswordRepository';
import { TaskRepository } from './data/repositories/TaskRepository';
import { LogRepository } from './data/repositories/LogRepository';
import { TaskService } from './services/TaskService';
import { LogService } from './services/LogService';
import { ILogRepository } from './data/interfaces/ILogRepository';
import { IUserRepository } from './data/interfaces/IUserRepository';
import { WeatherService } from './services/WeatherService';
import { Errback, Request, Response, NextFunction } from 'express';
import { HttpResponse } from './constants/HttpResponse';

const container = new Container();

container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
container.bind<TaskRepository>(Types.TaskRepository).to(TaskRepository);
container.bind<ILogRepository>(Types.LogRepository).to(LogRepository);
container.bind<UserService>(Types.UserService).to(UserService);
container.bind<AuthService>(Types.AuthService).to(AuthService);
container.bind<TaskService>(Types.TaskService).to(TaskService);
container.bind<LogService>(Types.LogService).to(LogService);
container.bind<WeatherService>(Types.WeatherService).to(WeatherService);
container.bind<ActivationPasswordRepository>(Types.ActivationPasswordRepository).to(ActivationPasswordRepository);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: 'http://localhost:3000' }));
    app.use(
        jwtMiddleware({
            secret: process.env.JWT_SECRET as string,
            algorithms: ['HS256'],
            requestProperty: 'payload',
        }).unless({
            path: ['/api/users/login', '/api/users/register', { url: /^\/api\/activation\/.*/ }, '/'],
        }),
    );
    app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
        if (err.name === 'UnauthorizedError') return res.status(401).json({ message: HttpResponse.UNAUTHORIZED });
        next();
    });
});

export default server.build();
