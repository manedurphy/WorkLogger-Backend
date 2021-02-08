import mysql from 'mysql2';
import seedAdmin from './mock/user';
import seedTask from './mock/task';
import seedActivationPassword from './mock/activationPassword';
import seedLog from './mock/log';

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.MySQL_USERNAME,
    password: process.env.MySQL_PASSWORD,
});

(async () => {
    try {
        await connection.promise().execute('DROP DATABASE IF EXISTS `workLogger`');
        await connection.promise().execute('CREATE DATABASE `workLogger`');
        connection.destroy();

        await seedAdmin();
        await seedTask();
        await seedActivationPassword();
        await seedLog();
    } catch (error) {
        throw error;
    }
})();
