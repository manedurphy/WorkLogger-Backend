import { injectable } from 'inversify';
import { User } from '../../models';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  private _users: User[] = [];

  get users() {
    return this._users;
  }

  public GetById(id: number): User | undefined {
    return this._users.find((user) => user.id === id);
  }

  public GetByEmail(email: string): User | undefined {
    return this._users.find((user) => user.email === email);
  }

  public async Get(): Promise<void> {
    const users = await User.findAll();
    this._users = users;
  }

  public async Add(user: User): Promise<User> {
    const newUser = await User.create(user);
    return newUser;
  }
}
