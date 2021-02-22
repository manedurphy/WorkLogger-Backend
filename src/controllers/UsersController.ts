import { Request, Response } from 'express';
import { IUserRepository } from '../data/interfaces/IUserRepository';
import { inject } from 'inversify';
import { Logger } from '@overnightjs/logger';
import { body } from 'express-validator';
import { UserService } from '../services/UserService';
import { Alert } from '../responseObjects/Alert';
import { LoggerMiddleware } from '../middleware/LoggerMiddleware';
import { HttpResponse } from '../constants/HttpResponse';
import { Types } from '../constants/Types';
import { IActivationPasswordRepository } from '../data/interfaces/IActivationPasswordRepository';
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
    private readonly userRepository: IUserRepository;
    private readonly activationPasswordRepository: IActivationPasswordRepository;
    private readonly userService: UserService;
    private readonly authService: AuthService;

    public constructor(
        @inject(Types.UserRepository) userRepository: IUserRepository,
        @inject(Types.ActivationPasswordRepository)
        activationPasswordRepository: IActivationPasswordRepository,
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
            const users = await this.userRepository.get();
            return this.ok(users);
        } catch (error) {
            Logger.Err('ERROR IN USERS ROUTE', error);
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
        body('lastName')
            .not()
            .isEmpty()
            .withMessage(ValidationMessages.LAST_NAME),
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
            const registrationFormErrorsPresent = this.userService.validateForm(
                req
            );
            const passordsMatch = this.userService.ValidatePassordsMatch(req);

            if (registrationFormErrorsPresent || !passordsMatch)
                return this.json(new Alert(this.userService.errorMessage), 400);

            const existingUser = await this.userRepository.getByEmail(
                req.body.email
            );
            if (existingUser)
                return this.json(new Alert(HttpResponse.USER_EXISTS), 400);

            await this.userService.HashPassword(req);

            const newUser = await this.userRepository.add(req.body);
            const activationPassword = this.activationPasswordRepository.add(
                newUser.id
            );

            if (process.env.REGISTER !== 'testing')
                this.authService.sendVerificationEmail(activationPassword); // For testing only. Remove for production.

            return this.created(
                '/register',
                new Alert(HttpResponse.USER_CREATED)
            );
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
            const loginFormsPresent = this.userService.validateForm(req);

            if (loginFormsPresent)
                return this.json(new Alert(this.userService.errorMessage), 400);

            const existingUser = await this.userRepository.getByEmail(
                req.body.email
            );
            if (!existingUser)
                return this.json(new Alert(HttpResponse.USER_NOT_FOUND), 404);

            if (process.env.LOGIN === 'testing')
                await existingUser.update({ active: true }); // For testing only. Remove for production.

            if (!existingUser.active)
                return this.json(
                    new Alert(HttpResponse.USER_NOT_VERIFIED),
                    400
                );

            const passwordIsCorrect = await this.userService.VerifyLoginPassword(
                req.body.password,
                existingUser.password
            );

            if (!passwordIsCorrect)
                return this.json(
                    new Alert(HttpResponse.INVALID_CREDENTIALS),
                    400
                );

            const userReadDto = this.userService.MapUserReadDto(existingUser);
            const token = this.authService.GenerateToken(userReadDto);
            const refreshToken = this.authService.GenerateRefreshToken(
                userReadDto
            );
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
            Logger.Err('ERROR IN VERIFY-TOKEN ROUTE', error);
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
            Logger.Err('ERROR IN REFRESH ROUTE', error);
            return this.internalServerError();
        }
    }
}
