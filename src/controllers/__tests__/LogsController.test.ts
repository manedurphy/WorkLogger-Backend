import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import { sampleData } from '../SampleData';
import { Log } from '../../models';

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
    .send(sampleData[0])
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

  it('should keep track of productivityHours in log item when hoursWorked is updated in a task', async () => {
    await request(app)
      .post('/api/tasks/')
      .send(sampleData[1])
      .set('Authorization', `Bearer ${token}`);

    let updatedTask = { ...sampleData[1] };
    for (let i = 0; i < 5; i++) {
      updatedTask.hoursWorked += 5;
      await request(app)
        .put('/api/tasks/2')
        .send(updatedTask)
        .set('Authorization', `Bearer ${token}`);
    }

    const res = await request(app)
      .get('/api/logs/2')
      .set('Authorization', `Bearer ${token}`);

    let count = 50;
    res.body.reverse().forEach((log: Log) => {
      expect(log.hoursWorked).toEqual(count);
      count += 5;
    });
  });

  it("should update a task's hoursWorked category when an log item is updated", async () => {
    const data = { ...sampleData[0] };
    const hours = new Array<number>(5, 8, 12, 18, 22); //db queries in descending order

    for (let i = 0; i < hours.length; i++) {
      data.hoursWorked = hours[i];
      await request(app)
        .put('/api/tasks/1')
        .send(data)
        .set('Authorization', `Bearer ${token}`);
    }

    const logItem = await request(app)
      .get('/api/logs/log-item/12')
      .set('Authorization', `Bearer ${token}`);

    expect(logItem.body.hoursWorked).toEqual(22);

    logItem.body.hoursWorked = 24;
    await request(app)
      .put('/api/logs/log-item/12')
      .send(logItem.body)
      .set('Authorization', `Bearer ${token}`);

    const updatedTask = await request(app)
      .get('/api/tasks/incomplete/1')
      .set('Authorization', `Bearer ${token}`);

    expect(updatedTask.body.hoursWorked).toEqual(24);
  });

  it('should adjust the hoursWorked on a task when a log item is deleted', async () => {
    const data = { ...sampleData[2] };
    const hours = [15, 18];

    await request(app)
      .post('/api/tasks')
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    for (let i = 0; i < 2; i++) {
      data.hoursWorked = hours[i];
      await request(app)
        .put('/api/tasks/3')
        .send(data)
        .set('Authorization', `Bearer ${token}`);
    }

    const log = await request(app)
      .get('/api/logs/3')
      .set('Authorization', `Bearer ${token}`);

    expect(log.body[2].productiveHours).toEqual(10); // original data
    expect(log.body[1].productiveHours).toEqual(5); // first loop
    expect(log.body[0].productiveHours).toEqual(3); // original data

    await request(app)
      .delete('/api/logs/log-item/14')
      .set('Authorization', `Bearer ${token}`);

    const task = await request(app)
      .get('/api/tasks/incomplete/3')
      .set('Authorization', `Bearer ${token}`);

    expect(task.body.hoursWorked).toEqual(18 - 5);
  });
});
