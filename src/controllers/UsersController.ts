import { Request, Response } from 'express';
import { IUserRepository } from '../data/interfaces/IUserRepository';
import { inject } from 'inversify';
import { Logger } from '@overnightjs/logger';
import { body } from 'express-validator';
import { UserService } from '../services/UserService';
import { Alert } from '../responseObjects/Alert';
import { logRoute } from '../middleware/logRoute';
import { HttpResponse } from '../constants/HttpResponse';
import { Types } from '../constants/Types';
import { IActivationPasswordRepository } from '../data/interfaces/IActivationPasswordRepository';
import { AuthService } from '../services/AuthService';
import { ValidationMessages } from '../constants/ValidationMessages';
import { AuthenticatedRequest } from './interfaces/authenticatedReq';
import { LoginRequest } from './interfaces/loginReq';
import {
    controller,
    httpGet,
    request,
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

    @httpPost(
        '/register',
        logRoute,
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
    private async register(@request() req: Request) {
        Logger.Warn(req.body, false);
        try {
            const errorsPresent = this.userService.validateForm(req);
            const passordsMatch = this.userService.verifyPassordsMatch(req);

            if (errorsPresent || !passordsMatch)
                return this.json(new Alert(this.userService.errorMessage), 400);

            const { email } = req.body;
            const existingUser = await this.userRepository.getByEmail(email);

            if (existingUser)
                return this.json(new Alert(HttpResponse.USER_EXISTS), 400);

            await this.userService.hashPassword(req);

            const newUser = await this.userRepository.add(req.body);
            const activationPassword = this.activationPasswordRepository.add(
                newUser.id
            );

            if (process.env.NODE_ENV !== 'testing')
                this.authService.sendVerificationEmail(activationPassword);

            return this.json(new Alert(HttpResponse.USER_CREATED), 201);
        } catch (error) {
            Logger.Err('ERROR IN REGISTER ROUTE', error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpPost(
        '/login',
        logRoute,
        body('email').not().isEmpty().withMessage(ValidationMessages.EMAIL),
        body('password')
            .not()
            .isEmpty()
            .withMessage(ValidationMessages.PASSWORD_MISSING)
    )
    private async login(@request() req: LoginRequest) {
        try {
            const loginFormsPresent = this.userService.validateForm(req);

            if (loginFormsPresent)
                return this.json(new Alert(this.userService.errorMessage), 400);

            const { email } = req.body;
            const existingUser = await this.userRepository.getByEmail(email);
            if (!existingUser)
                return this.json(new Alert(HttpResponse.USER_NOT_FOUND), 404);

            if (!existingUser.active)
                return this.json(
                    new Alert(HttpResponse.USER_NOT_VERIFIED),
                    400
                );

            const passwordIsCorrect = await this.userService.verifyLoginPassword(
                req.body.password,
                existingUser.password
            );

            if (!passwordIsCorrect)
                return this.json(
                    new Alert(HttpResponse.INVALID_CREDENTIALS),
                    400
                );

            const userReadDto = this.userService.getReadDto(existingUser);
            const token = this.authService.generateToken(userReadDto);

            const refreshToken = this.authService.generateRefreshToken(
                userReadDto
            );

            const userLoginResponseObject = this.userService.getLoginResponse(
                token,
                refreshToken,
                userReadDto
            );

            return this.ok(userLoginResponseObject);
        } catch (error) {
            Logger.Err('ERROR IN LOGIN ROUTE', error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpGet('/verify-token')
    private async verifyToken(@request() req: AuthenticatedRequest) {
        try {
            const { userInfo } = req.payload;
            return this.ok(this.userService.getTokenValidResponse(userInfo));
        } catch (error) {
            Logger.Err('ERROR IN VERIFY-TOKEN ROUTE', error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }

    @httpGet('/refresh')
    private async getNewToken(@request() req: AuthenticatedRequest) {
        try {
            const { userInfo } = req.payload;
            const token = this.authService.generateToken(userInfo);
            const refreshToken = this.authService.generateRefreshToken(
                userInfo
            );

            const refreshTokenResponse = this.userService.getRefreshTokenResponse(
                token,
                refreshToken,
                userInfo
            );

            return this.ok(refreshTokenResponse);
        } catch (error) {
            Logger.Err('ERROR IN REFRESH ROUTE', error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }
}
