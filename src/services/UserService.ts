import { Request } from 'express';
import { validationResult } from 'express-validator';
import { inject, injectable } from 'inversify';
import { ValidationMessages } from '../constants/ValidationMessages';
import { compare, hash } from 'bcrypt';
import { UserReadDto } from '../data/dtos/UserReadDto';
import { User } from '../models';
import { UserLoginResponseObject } from '../responseObjects/UserLoginResponse';
import { TokenService } from './TokenService';
import { Types } from '../constants/Types';

@injectable()
export class UserService {
  private _errorMessage: string = '';
  private tokenService: TokenService;

  get errorMessage() {
    return this._errorMessage;
  }

  public constructor(@inject(Types.TokenService) tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  public ValidateRegistrationForm(req: Request): boolean {
    const errors = validationResult(req);
    const errorsPresent = !errors.isEmpty();

    if (errorsPresent) {
      this._errorMessage = errors.array()[0].msg;
    }

    return errorsPresent;
  }

  public ValidatePassordsMatch(req: Request): boolean {
    const passwordsMatch = req.body.password === req.body.password2;

    if (!passwordsMatch) {
      this._errorMessage = ValidationMessages.PASSWORDS_DO_NOT_MATCH;
    }

    return passwordsMatch;
  }

  public async HashPassword(req: Request): Promise<void> {
    const hashPassword = await hash(req.body.password, 12);
    req.body.password = hashPassword;
  }

  public async VerifyLoginPassword(password: string, hashPassword: string) {
    const passwordsMatch = await compare(password, hashPassword);
    return passwordsMatch;
  }

  public MapUserReadDto(user: User): UserReadDto {
    return new UserReadDto(user.id, user.firstName, user.lastName, user.email);
  }

  public GetLoginResponse(user: UserReadDto) {
    const token = this.tokenService.GenerateToken(user);
    return new UserLoginResponseObject(token, user);
  }
}
