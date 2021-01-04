import { Optional } from 'sequelize';

export interface ActivationPasswordAttributes {
  id: number;
  password: string;
  UserId: number;
}

export interface ActivationPasswordCreationAttributes
  extends Optional<ActivationPasswordAttributes, 'id'> {}
