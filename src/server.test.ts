import 'reflect-metadata';
import app from './serverStart';
import request from 'supertest';
import sequelize from './data/SQLDatabase';

beforeAll(async () => await sequelize.sync());
afterAll(async () => await sequelize.close());

it('should send status code 200', async () => {
  const res = await request(app).get('/');
  expect(res.status).toEqual(200);
});
