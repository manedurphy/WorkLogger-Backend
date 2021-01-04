import * as express from 'express';
import jwtMiddleware from 'express-jwt';
import './data/SQLDatabase';
import './controllers';
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

const container = new Container();

container.bind<UserRepository>(Types.UserRepository).to(UserRepository);
container.bind<TaskRepository>(Types.TaskRepository).to(TaskRepository);
container.bind<LogRepository>(Types.LogRepository).to(LogRepository);
container.bind<UserService>(Types.UserService).to(UserService);
container.bind<AuthService>(Types.AuthService).to(AuthService);
container.bind<TaskService>(Types.TaskService).to(TaskService);
container
  .bind<ActivationPasswordRepository>(Types.ActivationPasswordRepository)
  .to(ActivationPasswordRepository);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    jwtMiddleware({
      secret: process.env.JWT_SECRET as string,
      algorithms: ['HS256'],
      requestProperty: 'payload',
    }).unless({
      path: ['/api/users/login', '/api/users/register'],
    })
  );
});

export default server.build();
