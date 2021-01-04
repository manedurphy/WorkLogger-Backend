import * as express from 'express';
import './data/SQLDatabase';
import './controllers';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { UserRepository } from './data/repositories/UserRepository';
import { Types } from './constants/Types';
import { UserService } from './services/UserService';
import { AuthService } from './services/AuthService';
import { ActivationPasswordRepository } from './data/repositories/ActivationPasswordRepository';

const container = new Container();

container.bind<UserRepository>(Types.UserRepository).to(UserRepository);
container.bind<UserService>(Types.UserService).to(UserService);
container.bind<AuthService>(Types.AuthService).to(AuthService);
container
  .bind<ActivationPasswordRepository>(Types.ActivationPasswordRepository)
  .to(ActivationPasswordRepository);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
});

export default server.build();
