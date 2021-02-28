import sequelize from '../data/SQLDatabase';
import { DataTypes, Model } from 'sequelize';

export class Log extends Model {
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
    public productiveHours!: number;
    public loggedAt!: Date;
    public TaskId!: number;
    public UserId!: number;

    public readonly createdAt!: Date;
}

Log.init(
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
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        hoursWorked: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        hoursRemaining: {
            type: DataTypes.DECIMAL(10, 2),
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
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        hoursRequiredByBim: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        complete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        productiveHours: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        // day: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        loggedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        TaskId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        createdAt: true,
        updatedAt: false,
        modelName: 'Log',
    },
);

export default Log;
