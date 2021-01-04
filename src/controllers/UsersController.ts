import { Request, Response } from 'express';
import { UserRepository } from '../data/repositories/UserRepository';
import { inject } from 'inversify';
import { Logger } from '@overnightjs/logger';
import { body } from 'express-validator';
import { UserService } from '../services/UserService';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { HttpResponse } from '../constants/HttpResponse';
import { Types } from '../constants/Types';
import { ActivationPasswordRepository } from '../data/repositories/ActivationPasswordRepository';
import { AuthService } from '../services/AuthService';
import { ValidationMessages } from '../constants/ValidationMessages';
import { AuthenticatedRequest } from './interfaces/interfaces';
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
  private readonly userRepository: UserRepository;
  private readonly activationPasswordRepository: ActivationPasswordRepository;
  private readonly userService: UserService;
  private readonly authService: AuthService;

  public constructor(
    @inject(Types.UserRepository) userRepository: UserRepository,
    @inject(Types.ActivationPasswordRepository)
    activationPasswordRepository: ActivationPasswordRepository,
    @inject(Types.UserService) userService: UserService,
    @inject(Types.AuthService) authService: AuthService
  ) {
    super();
    this.userRepository = userRepository;
    this.activationPasswordRepository = activationPasswordRepository;
    this.userService = userService;
    this.authService = authService;
  }

  @httpGet('/', LoggerMiddleware)
  private async GetUsers(@request() req: Request, @response() res: Response) {
    try {
      await this.userRepository.Get();
      return this.ok(this.userRepository.users);
    } catch (error) {
      Logger.Err(error);
      return this.internalServerError();
    }
  }

  @httpPost(
    '/register',
    LoggerMiddleware,
    body('firstName')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.FIRST_NAME),
    body('lastName').not().isEmpty().withMessage(ValidationMessages.LAST_NAME),
    body('email').isEmail().withMessage(ValidationMessages.EMAIL),
    body('password')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage(ValidationMessages.PASSWORD)
  )
  private async Register(@request() req: Request, @response() res: Response) {
    Logger.Warn(req.body, true);
    try {
      const registrationFormErrorsPresent = this.userService.ValidateForm(req);
      const passordsMatch = this.userService.ValidatePassordsMatch(req);

      if (registrationFormErrorsPresent || !passordsMatch)
        return this.badRequest(this.userService.errorMessage);

      const existingUser = this.userRepository.GetByEmail(req.body.email);
      if (existingUser) return this.badRequest(HttpResponse.USER_EXISTS);

      await this.userService.HashPassword(req);

      const newUser = await this.userRepository.Add(req.body);
      const activationPassword = this.activationPasswordRepository.Add(
        newUser.id
      );

      this.authService.sendVerificationEmail(activationPassword);

      return this.created('/register', { message: 'User created' }); //come back to this
    } catch (error) {
      Logger.Err('ERROR IN REGISTER ROUTE', error);
      return this.internalServerError();
    }
  }

  @httpPost(
    '/login',
    LoggerMiddleware,
    body('email').not().isEmpty().withMessage(ValidationMessages.EMAIL),
    body('password')
      .not()
      .isEmpty()
      .withMessage(ValidationMessages.PASSWORD_MISSING)
  )
  private async Login(@request() req: Request, @response() res: Response) {
    try {
      const loginFormsPresent = this.userService.ValidateForm(req);

      if (loginFormsPresent)
        return this.badRequest(this.userService.errorMessage);

      await this.userRepository.Get();

      const existingUser = this.userRepository.GetByEmail(req.body.email);
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
      const token = this.authService.GenerateToken(userReadDto);
      const refreshToken = this.authService.GenerateRefreshToken(userReadDto);
      const userLoginResponseObject = this.userService.GetLoginResponse(
        token,
        refreshToken,
        userReadDto
      );

      return this.ok(userLoginResponseObject);
    } catch (error) {
      Logger.Err('ERROR IN LOGIN ROUTE', error);
      return this.internalServerError();
    }
  }

  @httpGet('/verify-token')
  private async VerifyToken(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      return this.ok(
        this.userService.GetTokenValidResponse(req.payload.userInfo)
      );
    } catch (error) {
      return this.internalServerError();
    }
  }

  @httpGet('/refresh')
  private async GetNewToken(
    @request() req: AuthenticatedRequest,
    @response() res: Response
  ) {
    try {
      const token = this.authService.GenerateToken(req.payload.userInfo);
      const refreshToken = this.authService.GenerateRefreshToken(
        req.payload.userInfo
      );

      const refreshTokenResponse = this.userService.GetRefreshTokenResponse(
        token,
        refreshToken,
        req.payload.userInfo
      );

      return this.ok(refreshTokenResponse);
    } catch (error) {
      return this.internalServerError();
    }
  }
}
