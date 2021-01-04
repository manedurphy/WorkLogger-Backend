import { injectable } from 'inversify';
import { ActivationPassword } from '../../models';
import { IActivationPasswordRepository } from '../interfaces/IActivationPasswordRepository';

@injectable()
export class ActivationPasswordRepository
  implements IActivationPasswordRepository {
  public GenerateActivationPassword(): string {
    return require('crypto').randomBytes(80).toString('hex');
  }

  public async GetById(userId: number): Promise<ActivationPassword | null> {
    const activationPassword = await ActivationPassword.findOne({
      where: { UserId: userId },
    });
    return activationPassword;
  }

  public Add(userId: number): string {
    const activationPassword = this.GenerateActivationPassword();
    ActivationPassword.create({ password: activationPassword, UserId: userId });
    console.log(activationPassword);
    console.log('USER ID: ', userId);
    return activationPassword;
  }
}
