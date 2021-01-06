import { injectable } from 'inversify';
import { User } from '../../models';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  // private _users: User[] = [];

  // get users() {
  //   return this._users;
  // }

  public GetById(id: number): Promise<User | null> {
    // return this._users.find((user) => user.id === id);
    return User.findByPk(id);
  }

  public async GetByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  public async Get(): Promise<User[]> {
    // const users = await User.findAll();
    // this._users = users;
    return User.findAll();
  }

  public async Add(user: User): Promise<User> {
    const newUser = await User.create(user);
    return newUser;
  }
}
