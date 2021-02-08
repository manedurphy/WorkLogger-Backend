import { UserAttributes, UserCreationAttributes } from './interfaces/IUser';
import Task from './Task';
import sequelize from '../data/SQLDatabase';
import {
    Association,
    Model,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
} from 'sequelize';

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public active!: boolean;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    public getTasks!: HasManyGetAssociationsMixin<Task>;
    public addTask!: HasManyAddAssociationMixin<Task, number>;
    public hasTask!: HasManyHasAssociationMixin<Task, number>;
    public countTasks!: HasManyCountAssociationsMixin;
    public createTask!: HasManyCreateAssociationMixin<Task>;

    public readonly currentTasks!: Task[];
    public readonly completedTasks!: Task[];

    public static associations: {
        tasks: Association<User, Task>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'User',
    },
);

export default User;
