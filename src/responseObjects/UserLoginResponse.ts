import { UserReadDto } from '../data/dtos/UserReadDto';
import { IUserLoginResponseObject } from './interfaces/IUserLoginResponseObject';

export class UserLoginResponseObject implements IUserLoginResponseObject {
  public jwt: string;
  public user: UserReadDto;

  constructor(jwt: string, user: UserReadDto) {
    this.jwt = jwt;
    this.user = user;
  }
}
