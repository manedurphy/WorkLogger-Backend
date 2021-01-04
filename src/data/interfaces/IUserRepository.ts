import { User } from '../../models/User';
import { IRepository } from './IRepository';

export interface IUserRepository extends IRepository<User> {
  GetByEmail(email: string): Promise<User | null>;
}
