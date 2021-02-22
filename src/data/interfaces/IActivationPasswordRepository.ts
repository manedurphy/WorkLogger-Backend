import { ActivationPassword } from '../../models';

export interface IActivationPasswordRepository {
    generateActivationPassword(): string;
    add(userId: number): string;
    get(password: string): Promise<ActivationPassword | null>;
    update(activationPassword: ActivationPassword): Promise<void>;
}
