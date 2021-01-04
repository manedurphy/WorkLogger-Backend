import { injectable } from 'inversify';
import { User } from '../../models';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  public async Get(): Promise<User[]> {
    const users = await User.findAll();
    return users;
  }

  public async GetById(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    return user;
  }

  public async Add(user: User): Promise<User> {
    const newUser = await User.create(user);
    return newUser;
  }

  public async GetByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}
