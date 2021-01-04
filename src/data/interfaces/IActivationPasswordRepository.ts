import { ActivationPassword } from '../../models';

export interface IActivationPasswordRepository {
  GenerateActivationPassword(): string;
  Add(userId: number): void;
  GetById(id: number): Promise<ActivationPassword | null>;
}
