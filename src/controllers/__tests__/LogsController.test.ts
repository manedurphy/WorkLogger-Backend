import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';

const testTask = {
  name: 'Task 1',
  projectNumber: 1,
  hoursAvailableToWork: 100,
  hoursWorked: 0,
  hoursRemaining: 0,
  notes: 'Here are some notes',
  numberOfReviews: 0,
  reviewHours: 4,
  hoursRequiredByBim: 10,
  dateAssigned: '2021-03-01 08:00:00',
  dueDate: '2021-08-01 08:00:00',
};

const existingUser = {
  email: 'testuser@mail.com',
  password: 'password',
};

let token: string;

beforeAll(async () => {
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

  await request(app)
    .post('/api/tasks')
    .send(testTask)
    .set('Authorization', `Bearer ${token}`);
});

afterEach(async () => {
  server.close();
});

afterAll(async () => {
  await sequelize.drop();
  await sequelize.close();
});

describe('Log retreival', () => {
  it('should get an array of log items by task ID', async () => {
    const res = await request(app)
      .get('/api/logs/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('should receive a log item by its ID', async () => {
    const res = await request(app)
      .get('/api/logs/log-item/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('Task 1');
  });
});

// consider deleting a task if the only log is deleted
describe('Log updates and deletes', () => {
  it('should delete a log by its ID', async () => {
    const res = await request(app)
      .delete('/api/logs/log-item/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(204);
  });
});
