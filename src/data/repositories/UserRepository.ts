import { inject, injectable } from 'inversify';
import { Types } from '../../constants/Types';
import { User } from '../../models';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ActivationPasswordRepository } from './ActivationPasswordRepository';

@injectable()
export class UserRepository implements IUserRepository {
  private readonly activationPasswordRepository: ActivationPasswordRepository;

  public constructor(
    @inject(Types.ActivationPasswordRepository)
    activationPasswordRepository: ActivationPasswordRepository
  ) {
    this.activationPasswordRepository = activationPasswordRepository;
  }

  public async Get(): Promise<User[]> {
    const users = await User.findAll();
    return users;
  }

  public async GetById(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    return user;
  }

  public async Add(user: User): Promise<void> {
    const newUser = await User.create(user);
    this.activationPasswordRepository.Add(newUser.id);
  }

  public async GetByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}
