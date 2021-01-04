import { ActivationPassword } from '../../models';

export interface IActivationPasswordRepository {
  GenerateActivationPassword(): string;
  Add(userId: number): string;
  GetById(id: number): Promise<ActivationPassword | null>;
}
