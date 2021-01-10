import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';

const existingUser = {
  email: 'testuser@mail.com',
  password: 'password',
};

let token: string;

beforeAll(async () => {
  process.env.REGISTER = 'testing';
  process.env.LOGIN = 'testing';
  await sequelize.sync();

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@mail.com',
    password: 'password',
    password2: 'password',
  };
  await request(app).post('/api/users/register').send(testUser);
  const res = await request(app).post('/api/users/login').send(existingUser);
  token = res.body.jwt;
});
afterEach(() => server.close());

afterAll(async () => {
  await sequelize.drop();
  await sequelize.close();
});

it('should access data from weather api', async () => {
  const res = await request(app)
    .get('/api/weather')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);
  expect(res.body.weather).not.toBeNull();
});

it('should not be able to get weather data when not authorized', async () => {
  const res = await request(app).get('/api/weather');

  expect(res.status).toEqual(401);
});
