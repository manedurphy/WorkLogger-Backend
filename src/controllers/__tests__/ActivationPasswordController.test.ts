import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import ActivationPassword from '../../models/ActivationPassword';
import User from '../../models/User';
import userData from '../../mock/user/userData';
import activationPasswordData from '../../mock/activationPassword/activationPasswordData';
import { HttpResponse } from '../../constants/HttpResponse';

beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    await sequelize.sync({ force: true });
    await User.create(userData.create.active);
    await ActivationPassword.create(activationPasswordData.create);
});

afterAll(() => server.close());

describe('Activation Password Controller /api/activation', () => {
    test('/GET /:password', async () => {
        const res = await request(app).get('/api/activation/12345');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(HttpResponse.USER_ACTIVATED);
    });

    test('/GET /:password after the success', async () => {
        const res = await request(app).get('/api/activation/12345');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.INVALID_PASSWORD);
    });
});
