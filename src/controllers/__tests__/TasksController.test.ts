import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import userData from '../../mock/user/userData';
import taskData from '../../mock/task/taskData';
import User from '../../models/User';

// const testTask = {
//     name: 'Task 1',
//     projectNumber: 1,
//     hoursAvailableToWork: 100,
//     hoursWorked: 5,
//     hoursRemaining: 0,
//     notes: 'Here are some notes',
//     numberOfReviews: 0,
//     reviewHours: 4,
//     hoursRequiredByBim: 10,
//     dateAssigned: '2021-03-01 08:00:00',
//     dueDate: '2021-08-01 08:00:00',
// };

// const existingUser = {
//     email: 'testuser@mail.com',
//     password: 'password',
// };

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
    test('/POST /incomplete should get incomplete tasks for user', async () => {
        const res = await request(app)
            .get('/api/tasks/incomplete')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    //     it('should create a new task for a logged in user', async () => {
    //         const res = await request(app)
    //             .post('/api/tasks')
    //             .send(testTask)
    //             .set('Authorization', `Bearer ${token}`);

    //         expect(res.status).toEqual(201);
    //         expect(res.body.message).toEqual('Task created!');
    //     });

    //     it('should not allow a user to create another task with the same project number', async () => {
    //         const res = await request(app)
    //             .post('/api/tasks')
    //             .send(testTask)
    //             .set('Authorization', `Bearer ${token}`);

    //         expect(res.status).toEqual(400);
    //         expect(res.text).toEqual(
    //             'Task with that project number already exists.'
    //         );
    //     });

    //     it('should not allow task creation with missing form input', async () => {
    //         const testTask = {
    //             name: 'Task 1',
    //             hoursAvailableToWork: 100,
    //             hoursWorked: 0,
    //             hoursRemaining: 0,
    //             notes: 'Here are some notes',
    //             numberOfReviews: 0,
    //             reviewHours: 4,
    //             hoursRequiredByBim: 10,
    //             dateAssigned: '2021-03-01 08:00:00',
    //             dueDate: '2021-08-01 08:00:00',
    //         };

    //         const res = await request(app)
    //             .post('/api/tasks')
    //             .send(testTask)
    //             .set('Authorization', `Bearer ${token}`);

    //         expect(res.status).toEqual(400);
    //         expect(res.text).toEqual('Project number is missing');
    //     });
});

// describe('Task GET, PUT, and DELETE', () => {
//     it('should forbid http request without token', async () => {
//         const res = await request(app).get('/api/tasks/incomplete');
//         expect(res.status).toEqual(401);
//     });

//     it('should receive an array of all incomplete tasks', async () => {
//         const res = await request(app)
//             .get('/api/tasks/incomplete')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.length).toEqual(1);
//     });

//     it('should receive an incomplete task by its ID', async () => {
//         const res = await request(app)
//             .get('/api/tasks/incomplete/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.id).toEqual(1);
//         expect(res.body.name).toEqual('Task 1');
//     });

//     it('should calculate the hoursRemaining property for the user', async () => {
//         const res = await request(app)
//             .get('/api/tasks/incomplete/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.body.hoursRemaining).toEqual(81);
//     });

//     it('should update a task from incomplete to complete', async () => {
//         const res = await request(app)
//             .put('/api/tasks/incomplete/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Task complete!');
//     });

//     it('should receive an array of all complete tasks', async () => {
//         const res = await request(app)
//             .get('/api/tasks/complete')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.length).toEqual(1);
//     });

//     it('should update a task from complete to incomplete', async () => {
//         const res = await request(app)
//             .put('/api/tasks/complete/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Task marked as incomplete');
//     });

//     it('should update contents of a task by its ID', async () => {
//         const updatedTestTask = {
//             name: 'Task 1',
//             projectNumber: 1,
//             hoursAvailableToWork: 100,
//             hoursWorked: 10,
//             hoursRemaining: 0,
//             notes: 'Here are some notes',
//             numberOfReviews: 0,
//             reviewHours: 4,
//             hoursRequiredByBim: 10,
//             dateAssigned: '2021-03-01 08:00:00',
//             dueDate: '2021-08-01 08:00:00',
//         };
//         const res = await request(app)
//             .put('/api/tasks/1')
//             .send(updatedTestTask)
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Task updated!');

//         const taskRes = await request(app)
//             .get('/api/tasks/incomplete/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(taskRes.status).toEqual(200);
//         expect(taskRes.body.hoursWorked).toEqual(10);
//     });

//     it('should delete a task by its ID', async () => {
//         const res = await request(app)
//             .delete('/api/tasks/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Task deleted!');

//         const task = await request(app)
//             .get('/api/tasks/1')
//             .set('Authorization', `Bearer ${token}`);

//         expect(task.status).toEqual(404);
//     });
// });
