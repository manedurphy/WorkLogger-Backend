import * as express from 'express';
import './data/SQLDatabase';
import './controllers';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { UserRepository } from './data/repositories/UserRepository';
import { Types } from './constants/Types';
import { UserService } from './services/UserService';
import { TokenService } from './services/TokenService';

const container = new Container();

container.bind<UserRepository>(Types.UserRepository).to(UserRepository);
container.bind<UserService>(Types.UserService).to(UserService);
container.bind<TokenService>(Types.TokenService).to(TokenService);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
});

export default server.build();
