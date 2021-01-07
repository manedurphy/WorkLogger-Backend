import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';

beforeAll(async () => await sequelize.sync());

afterEach(async () => {
  server.close();
});

afterAll(async () => {
  await sequelize.drop();
  await sequelize.close();
});

describe('User registration and login', () => {
  it('should not login a non-existing user', async () => {
    const nonExistingUser = {
      email: 'testuser@mail.com',
      password: 'password',
    };

    const res = await request(app)
      .post('/api/users/login')
      .send(nonExistingUser);

    expect(res.status).toBe(404);
    expect(res.text).toEqual('Not Found');
  });

  it('should register a user in the database', async () => {
    process.env.REGISTER = 'testing';
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@mail.com',
      password: 'password',
      password2: 'password',
    };

    const res = await request(app).post('/api/users/register').send(testUser);

    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual(
      'User created! Please check your email to verify your account.'
    );
  });

  it('should not register a user that already exists', async () => {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@mail.com',
      password: 'password',
      password2: 'password',
    };

    const res = await request(app).post('/api/users/register').send(testUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual(
      'User with this email already exists. Please try a different one.'
    );
  });

  it('should not be able to login without having verified account', async () => {
    const existingUser = {
      email: 'testuser@mail.com',
      password: 'password',
    };

    const res = await request(app).post('/api/users/login').send(existingUser);

    expect(res.status).toBe(400);
    expect(res.text).toEqual('This account has not been verified.');
  });

  it('should login a user with an active account', async () => {
    process.env.LOGIN = 'testing';
    const existingUser = {
      email: 'testuser@mail.com',
      password: 'password',
    };

    const res = await request(app).post('/api/users/login').send(existingUser);

    expect(res.status).toEqual(200);
    expect(res.body.jwt).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.firstName).toEqual('Test');
    expect(res.body.lastName).toEqual('User');
    expect(res.body.email).toEqual('testuser@mail.com');
  });

  it('should not log a user in with an invalid password', async () => {
    const existingUser = {
      email: 'testuser@mail.com',
      password: 'passwor',
    };

    const res = await request(app).post('/api/users/login').send(existingUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual('Invalid credentials. Please try again.');
  });
});
