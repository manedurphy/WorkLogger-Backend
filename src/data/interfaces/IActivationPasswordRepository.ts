import { ActivationPassword } from '../../models';

export interface IActivationPasswordRepository {
    GenerateActivationPassword(): string;
    Add(userId: number): string;
    get(password: string): Promise<ActivationPassword | null>;
    update(activationPassword: ActivationPassword): Promise<void>;
}
