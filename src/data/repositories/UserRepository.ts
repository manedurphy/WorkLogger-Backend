import { injectable } from 'inversify';
import { User } from '../../models';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  public GetById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  public async GetByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  public async Get(): Promise<User[]> {
    return User.findAll();
  }

  public async Add(user: User): Promise<User> {
    const newUser = await User.create(user);
    return newUser;
  }
}
