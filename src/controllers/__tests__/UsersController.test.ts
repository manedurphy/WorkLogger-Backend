import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';

beforeAll(async () => {
  process.env.REGISTER = 'testing';
  await sequelize.sync();
});

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

  it('should not register a user if passwords do not match', async () => {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@mail.com',
      password: 'password',
      password2: 'passwordsss',
    };

    const res = await request(app).post('/api/users/register').send(testUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual('Passwords do not match. Please try again.');
  });

  it('should register a user', async () => {
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

describe('User registration and login form validation', () => {
  it('should not allow registration with a missing input', async () => {
    const testUser = {
      firstName: 'Test',
      email: 'testuser@mail.com',
      password: 'password',
      password2: 'password',
    };

    const res = await request(app).post('/api/users/register').send(testUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual('Must include last name');
  });

  it('should not allow registration with an invalid email', async () => {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testusermail.com',
      password: 'password',
      password2: 'password',
    };

    const res = await request(app).post('/api/users/register').send(testUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual('Invalid email');
  });

  it('should not allow registration with a password under 6 characters', async () => {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testusers@mail.com',
      password: 'pass',
      password2: 'pass',
    };

    const res = await request(app).post('/api/users/register').send(testUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual('Password must be at least 6 characters long');
  });

  it('should not allow login with a missing input', async () => {
    const testUser = {
      email: 'testuser@mail.com',
    };

    const res = await request(app).post('/api/users/login').send(testUser);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual('Please enter your password');
  });
});
