import { Request, Response } from 'express';
import { UserRepository } from '../data/repositories/UserRepository';
import { inject } from 'inversify';
import { Logger } from '@overnightjs/logger';
import { body } from 'express-validator';
import { UserService } from '../services/UserService';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { HttpResponse } from '../constants/HttpResponse';
import {
  controller,
  httpGet,
  request,
  response,
  httpPost,
  BaseHttpController,
} from 'inversify-express-utils';

@controller('/api/users')
export class UsersController extends BaseHttpController {
  private userRepository: UserRepository;
  private userService: UserService;

  public constructor(
    @inject('UserRepository') userRepository: UserRepository,
    @inject('UserService') userService: UserService
  ) {
    super();
    this.userRepository = userRepository;
    this.userService = userService;
  }

  @httpGet('/', LoggerMiddleware)
  private async GetUsers(@request() req: Request, @response() res: Response) {
    try {
      const users = await this.userRepository.Get();
      return this.ok(users);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }

  @httpPost(
    '/register',
    LoggerMiddleware,
    body('firstName').not().isEmpty().withMessage('Must include first name'),
    body('lastName').not().isEmpty().withMessage('Must include last name'),
    body('email').isEmail().withMessage('Invalid email')
  )
  private async Register(@request() req: Request, @response() res: Response) {
    Logger.Warn(req.body, true);
    try {
      const registrationFormErrorsPresent = this.userService.ValidateRegistrationForm(
        req
      );
      const passordsMatch = this.userService.ValidatePassordsMatch(req);

      if (registrationFormErrorsPresent || !passordsMatch)
        return this.badRequest(this.userService.errorMessage);

      const existingUser = await this.userRepository.GetByEmail(req.body.email);
      if (existingUser) return this.badRequest(HttpResponse.USER_EXISTS);

      await this.userService.HashPassword(req);

      this.userRepository.Add(req.body);
      return this.created('/register', { message: 'User created' }); //come back to this
    } catch (error) {
      Logger.Err('ERROR IN REGISTER ROUTE', error);
      return this.internalServerError();
    }
  }

  @httpPost('/login')
  private async Login(@request() req: Request, @response() res: Response) {
    try {
      const existingUser = await this.userRepository.GetByEmail(req.body.email);
      if (!existingUser) return this.notFound();

      if (!existingUser.active)
        return this.badRequest(HttpResponse.USER_NOT_VERIFIED);

      const passwordIsCorrect = await this.userService.VerifyLoginPassword(
        req.body.password,
        existingUser.password
      );

      if (!passwordIsCorrect)
        return this.badRequest(HttpResponse.INVALID_CREDENTIALS);

      const userReadDto = this.userService.MapUserReadDto(existingUser);
      const userLoginResponseObject = this.userService.GetLoginResponse(
        userReadDto
      );
      return this.ok(userLoginResponseObject);
    } catch (error) {
      Logger.Err('ERROR IN LOGIN ROUTE', error);
      return this.internalServerError();
    }
  }
}
