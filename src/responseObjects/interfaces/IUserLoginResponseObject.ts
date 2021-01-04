import { UserReadDto } from '../../data/dtos/UserReadDto';

export interface IUserLoginResponseObject {
  jwt: string;
  user: UserReadDto;
}
