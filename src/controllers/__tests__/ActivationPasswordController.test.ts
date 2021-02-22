import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import ActivationPassword from '../../models/ActivationPassword';
import User from '../../models/User';
import userData from '../../mock/user/userData';
import activationPasswordData from '../../mock/activationPassword/activationPasswordData';

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create(userData.create.active);
    await ActivationPassword.create(activationPasswordData.create);
});

afterAll(() => server.close());

describe('Activation Password Controller /api/activation', () => {
    test('/GET /:password', async () => {
        const res = await request(app).get('/api/activation/12345');
        expect(res.status).toBe(200);
    });

    test('/GET /:password after the success', async () => {
        const res = await request(app).get('/api/activation/12345');
        expect(res.status).toBe(400);
    });
});
