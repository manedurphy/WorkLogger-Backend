import { Request } from 'express';
import { injectable } from 'inversify';
import { ValidationMessages } from '../constants/ValidationMessages';
import { compare, hash } from 'bcrypt';
import { UserReadDto } from '../data/dtos/UserReadDto';
import { User } from '../models';
import { UserLoginResponseObject } from '../responseObjects/UserLoginResponse';
import { UserTokenValidResponseObject } from '../responseObjects/UserTokenValidResponseObject';
import { UserRefreshTokenResponseObject } from '../responseObjects/UserRefreshTokenResponseObject';
import { ValidationService } from './ValidationService';

@injectable()
export class UserService extends ValidationService {
  public constructor() {
    super();
  }

  public ValidatePassordsMatch(req: Request): boolean {
    const passwordsMatch = req.body.password === req.body.password2;

    if (!passwordsMatch) {
      this.errorMessage = ValidationMessages.PASSWORDS_DO_NOT_MATCH;
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

  public GetLoginResponse(
    token: string,
    refreshToken: string,
    user: UserReadDto
  ) {
    return new UserLoginResponseObject(token, refreshToken, user);
  }

  public GetRefreshTokenResponse(
    token: string,
    refreshToken: string,
    user: UserReadDto
  ) {
    return new UserRefreshTokenResponseObject(token, refreshToken, user);
  }

  public GetTokenValidResponse(user: UserReadDto) {
    return new UserTokenValidResponseObject(user);
  }
}
