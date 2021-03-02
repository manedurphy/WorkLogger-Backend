import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import User from '../../models/User';
import Task from '../../models/Task';
import Log from '../../models/Log';
import userData from '../../mock/user/userData';
import taskData from '../../mock/task/taskData';
import logData from '../../mock/log/logData';
import { HttpResponse } from '../../constants/HttpResponse';

beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    await sequelize.sync({ force: true });
    await request(app).post('/api/users/register').send(userData.register.success);

    const user = await User.findByPk(1);
    user.update({ active: true });

    await Task.create(taskData.create);
    await Log.create(logData.create.log1);
    await Log.create(logData.create.log2);
});

afterEach(() => server.close());

describe('Log Controller /api/logs', () => {
    test('/PUT /log-item/:id', async () => {
        const user = await request(app).post('/api/users/login').send(userData.login.success);

        const res = await request(app)
            .put('/api/logs/log-item/1')
            .set('Authorization', `Bearer ${user.body.jwt}`)
            .send(logData.update);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(HttpResponse.LOG_UPDATED);
    });

    test('/DELETE /log-item/:id', async () => {
        const user = await request(app).post('/api/users/login').send(userData.login.success);

        const res = await request(app).delete('/api/logs/log-item/1').set('Authorization', `Bearer ${user.body.jwt}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(HttpResponse.LOG_ITEM_DELETED);
    });

    test('/DELETE /log-item/:id after deleting item', async () => {
        const user = await request(app).post('/api/users/login').send(userData.login.success);

        const res = await request(app).delete('/api/logs/log-item/1').set('Authorization', `Bearer ${user.body.jwt}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe(HttpResponse.LOG_ITEM_NOT_FOUND);
    });

    test('/DELETE /log-item/:id with 1 item in db', async () => {
        const user = await request(app).post('/api/users/login').send(userData.login.success);
        const res = await request(app).delete('/api/logs/log-item/2').set('Authorization', `Bearer ${user.body.jwt}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.LOG_NO_DELETE);
    });

    test('/GET /logs/dates', async () => {
        const user = await request(app).post('/api/users/login').send(userData.login.success);
        const res = await request(app).get('/api/logs/dates').set('Authorization', `Bearer ${user.body.jwt}`);

        expect(res.body).toHaveProperty('1');
        expect(res.body[1][0]).toHaveProperty('hours');
        expect(res.body[1][0]).toHaveProperty('day');
        expect(res.body[1]).toHaveLength(7);
    });
});
