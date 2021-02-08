import { IUserReadDto } from '../interfaces/IUserReadDto';

export class UserReadDto implements IUserReadDto {
    public constructor(public id: number, public firstName: string, public lastName: string, public email: string) {}
}
