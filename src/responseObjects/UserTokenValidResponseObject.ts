import { UserReadDto } from '../data/dtos/UserReadDto';
import { IUserTokenValidResponseObject } from './interfaces/interfaces';

export class UserTokenValidResponseObject
  implements IUserTokenValidResponseObject {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;

  public constructor(user: UserReadDto) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}
