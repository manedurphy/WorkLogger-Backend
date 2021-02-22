import { injectable } from 'inversify';
import { ActivationPassword, User } from '../../models';
import { IActivationPasswordRepository } from '../interfaces/IActivationPasswordRepository';

@injectable()
export class ActivationPasswordRepository
    implements IActivationPasswordRepository {
    public async get(password: string): Promise<ActivationPassword | null> {
        const activationPassword = await ActivationPassword.findOne({
            where: { password },
        });
        return activationPassword;
    }

    public add(userId: number): string {
        const activationPassword = this.generateActivationPassword();
        ActivationPassword.create({
            password: activationPassword,
            UserId: userId,
        });
        return activationPassword;
    }

    public generateActivationPassword(): string {
        return require('crypto').randomBytes(80).toString('hex');
    }

    public async update(activationPassword: ActivationPassword): Promise<void> {
        const user = await User.findOne({
            where: { id: activationPassword.UserId },
        });

        if (user) {
            user.update({ active: true });
            activationPassword.destroy();
        }
    }
}
