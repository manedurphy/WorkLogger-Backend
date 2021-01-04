import { Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  password: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}
