import sequelize from '../data/SQLDatabase';
import { Model, DataTypes } from 'sequelize';
import { ActivationPasswordAttributes, ActivationPasswordCreationAttributes } from './interfaces/IActivationPassword';

export class ActivationPassword
    extends Model<ActivationPasswordAttributes, ActivationPasswordCreationAttributes>
    implements ActivationPasswordAttributes {
    public id!: number;
    public password!: string;
    public UserId!: number;
}

ActivationPassword.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
    },
);

export default ActivationPassword;
