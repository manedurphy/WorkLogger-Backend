import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE as string,
    process.env.MySQL_USERNAME as string,
    process.env.MySQL_PASSWORD as string,
    {
        host: process.env.DATABASE_HOST as string,
        dialect: 'mysql',
        logging: false,
        timezone: '-08:00',
    },
);

export default sequelize;
