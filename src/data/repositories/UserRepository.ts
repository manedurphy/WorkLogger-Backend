import { injectable } from 'inversify';
import { User } from '../../models';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
    public getById(id: number): Promise<User | null> {
        return User.findByPk(id);
    }

    public async getByEmail(email: string): Promise<User | null> {
        return User.findOne({ where: { email } });
    }

    public async get(): Promise<User[]> {
        return User.findAll();
    }

    public async add(user: User): Promise<User> {
        const newUser = await User.create(user);
        return newUser;
    }
}
