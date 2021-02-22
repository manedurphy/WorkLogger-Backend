import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import userData from '../../mock/user/userData';
import taskData from '../../mock/task/taskData';
import Task from '../../models/Task';
import User from '../../models/User';
import { HttpResponse } from '../../constants/HttpResponse';
import { ValidationMessages } from '../../constants/ValidationMessages';

let token: string;

beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    await sequelize.sync({ force: true });

    await request(app)
        .post('/api/users/register')
        .send(userData.register.success);
    const user = await User.findByPk(1);
    if (user) await user.update({ active: true });

    const loginRes = await request(app)
        .post('/api/users/login')
        .send(userData.login.success);

    token = loginRes.body.jwt;

    await request(app)
        .post('/api/tasks')
        .send(taskData.create)
        .set('Authorization', `Bearer ${token}`);
});

afterEach(() => server.close());

describe('/api/tasks', () => {
    test('/GET /incomplete should get incomplete tasks for user', async () => {
        const res = await request(app)
            .get('/api/tasks/incomplete')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    test('/GET /complete should get incomplete tasks for user', async () => {
        const res = await request(app)
            .get('/api/tasks/complete')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });
    test('/GET /:id', async () => {
        const res = await request(app)
            .get('/api/tasks/1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('projectNumber');
        expect(res.body).toHaveProperty('hoursAvailableToWork');
        expect(res.body).toHaveProperty('hoursWorked');
        expect(res.body).toHaveProperty('hoursRemaining');
        expect(res.body).toHaveProperty('notes');
        expect(res.body).toHaveProperty('numberOfReviews');
        expect(res.body).toHaveProperty('reviewHours');
        expect(res.body).toHaveProperty('hoursRequiredByBim');
        expect(res.body).toHaveProperty('complete');
        expect(res.body).toHaveProperty('dateAssigned');
        expect(res.body).toHaveProperty('dueDate');
        expect(res.body).toHaveProperty('UserId');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('Logs');
    });
    test('/POST / should create a new task', async () => {
        const res = await request(app)
            .post('/api/tasks/')
            .send(taskData.success)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe(HttpResponse.TASK_CREATED);
    });

    test('/POST / should fail if task with same project number exists', async () => {
        const res = await request(app)
            .post('/api/tasks/')
            .send(taskData.success)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.TASK_EXISTS);
    });
    test('/POST / should fail if information is missing', async () => {
        const res = await request(app)
            .post('/api/tasks/')
            .send(taskData.invalid)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(ValidationMessages.PROJECT_NUMBER);
    });
    test('/PUT /', async () => {
        const task = await Task.findByPk(2);
        if (task) expect(task.hoursWorked).toBe('0.00');

        const res = await request(app)
            .put('/api/tasks/2')
            .send(taskData.update)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(HttpResponse.TASK_UPDATE);

        const updatedTask = await Task.findByPk(2);
        expect(updatedTask.hoursWorked).toBe('10.00');
    });
    test('/PUT / should fail if task does not exist', async () => {
        const res = await request(app)
            .put('/api/tasks/200')
            .send(taskData.update)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe(HttpResponse.TASK_NOT_FOUND);
    });
});
