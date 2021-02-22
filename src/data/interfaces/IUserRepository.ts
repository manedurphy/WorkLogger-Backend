import { User } from '../../models/User';

export interface IUserRepository {
    get(): Promise<User[]>;
    getById(id: number): Promise<User | null>;
    add(entity: User): Promise<User>;
    getByEmail(email: string): Promise<User | null>;
}
