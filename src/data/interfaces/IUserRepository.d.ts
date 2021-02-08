import { User } from '../../models/User';
import { IRepository } from './IRepository';

export interface IUserRepository {
    Get(): Promise<User[]>;
    GetById(id: number): Promise<User | null>;
    Add(entity: User): Promise<User>;
    GetByEmail(email: string): Promise<User | null>;
}
