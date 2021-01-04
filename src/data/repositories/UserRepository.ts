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

  public Add(user: User): void {
    User.create(user);
  }

  public async GetByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}
