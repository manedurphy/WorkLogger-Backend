import sequelize from '../data/SQLDatabase';
import { Model, DataTypes } from 'sequelize';
import { TaskAttributes, TaskCreationAttributes } from './interfaces/ITask';

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public name!: string;
    public projectNumber!: number;
    public hoursAvailableToWork!: number;
    public hoursWorked!: number;
    public hoursRemaining!: number;
    public notes!: string | null;
    public numberOfReviews!: number;
    public reviewHours!: number;
    public hoursRequiredByBim!: number;
    public complete!: boolean;
    public UserId!: number;
    public dateAssigned!: Date;
    public dueDate!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        projectNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hoursAvailableToWork: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hoursWorked: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hoursRemaining: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        numberOfReviews: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewHours: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hoursRequiredByBim: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        complete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        dateAssigned: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: 'Task',
    },
);

export default Task;
