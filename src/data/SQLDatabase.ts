import { Logger } from '@overnightjs/logger';
import { DataTypes, Sequelize } from 'sequelize';
import * as Models from '../models';

let sequelize: Sequelize;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  sequelize = new Sequelize(
    'workLogger',
    process.env.MySQL_USERNAME as string,
    process.env.MySQL_PASSWORD as string,
    {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,
    }
  );
}

Models.User.init(
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
  }
);

Models.Task.init(
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
  }
);

Models.ActivationPassword.init(
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
  }
);

Models.Log.init(
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
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekOf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productiveHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
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
  }
);

Models.User.hasMany(Models.Task);
Models.User.hasOne(Models.ActivationPassword);
Models.Task.hasMany(Models.Log);
Models.User.hasMany(Models.Log);
Models.ActivationPassword.belongsTo(Models.User);
Models.Task.belongsTo(Models.User);
Models.Log.belongsTo(Models.User);
Models.Log.belongsTo(Models.Task);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    Logger.Err('ERROR IN DB SYNC', error);
  }
})();

export default sequelize;
