import { UserReadDto } from '../data/dtos/UserReadDto';
import { IUserRefreshTokenResponseObject } from './interfaces/interfaces';

export class UserRefreshTokenResponseObject
  implements IUserRefreshTokenResponseObject {
  public jwt: string;
  public refreshToken: string;
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;

  public constructor(jwt: string, refreshToken: string, user: UserReadDto) {
    this.jwt = jwt;
    this.refreshToken = refreshToken;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}
