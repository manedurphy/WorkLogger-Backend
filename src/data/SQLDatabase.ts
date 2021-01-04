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
      type: DataTypes.STRING,
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

Models.User.hasMany(Models.Task);
Models.User.hasOne(Models.ActivationPassword);
Models.ActivationPassword.belongsTo(Models.User);
Models.Task.belongsTo(Models.User);

(async () => {
  await Models.User.sync();
  await Models.Task.sync();
})();

export default sequelize;
