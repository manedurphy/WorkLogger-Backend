import { ActivationPassword } from '../../models';

export interface IActivationPasswordRepository {
    GenerateActivationPassword(): string;
    Add(userId: number): string;
    Get(password: string): Promise<ActivationPassword | null>;
    Update(activationPassword: ActivationPassword): Promise<void>;
}
