import Log from '../../../models/Log';

const log = {
    name: 'Task 1',
    projectNumber: 1,
    hoursAvailableToWork: 100,
    hoursWorked: 10,
    notes: 'First task for seeding',
    numberOfReviews: 5,
    reviewHours: 5,
    hoursRequiredByBim: 2,
    hoursRemaining: 50,
    complete: false,
    day: 1,
    weekOf: '20201-03-27',
    productiveHours: 10,
    loggedAt: new Date(),
    createdAt: new Date(),
    TaskId: 1,
    UserId: 1,
};

export default async function () {
    await Log.sync();
    return Log.create(log);
}
