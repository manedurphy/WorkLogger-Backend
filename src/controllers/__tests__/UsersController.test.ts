import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import userData from '../../mock/user/userData';
import { HttpResponse } from '../../constants/HttpResponse';
import { ValidationMessages } from '../../constants/ValidationMessages';

beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    await sequelize.sync({ force: true });
});

afterEach(async () => {
    server.close();
});

describe('Users Controller /api/users', () => {
    test('/POST /register fails on invalid form data', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send(userData.register.fail);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            ValidationMessages.PASSWORDS_DO_NOT_MATCH
        );
    });
    test('/POST /register sucess', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send(userData.register.success);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe(HttpResponse.USER_CREATED);
    });

    test('/POST /register fails if user exists', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send(userData.register.success);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.USER_EXISTS);
    });
    test('/POST /login fails with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send(userData.login.fail);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.INVALID_CREDENTIALS);
    });
    test('/POST /login success', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send(userData.login.success);

        expect(res.status).toBe(200);
        expect(res.body.jwt).toBeTruthy();
        expect(res.body.refreshToken).toBeTruthy();
        expect(res.body.firstName).toBe('Test');
        expect(res.body.lastName).toBe('User');
        expect(res.body.email).toBe('testuser@mail.com');
    });
    test('/POST /login fail on active property', async () => {
        process.env.NODE_ENV = 'regFail';
        await request(app)
            .post('/api/users/register')
            .send(userData.register.inactive);

        const res = await request(app)
            .post('/api/users/login')
            .send(userData.register.inactive);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.USER_NOT_VERIFIED);
    });
});
