import Log from '../../../models/Log';

const log = {
    name: 'Task 1',
    projectNumber: 1,
    hoursAvailableToWork: 100,
    hoursWorked: 0,
    notes: 'First task for seeding',
    numberOfReviews: 0,
    reviewHours: 0,
    hoursRequiredByBim: 0,
    hoursRemaining: 100,
    complete: false,
    productiveHours: 0,
    loggedAt: new Date(),
    createdAt: new Date(),
    TaskId: 1,
    UserId: 1,
};

export default async function (): Promise<Log> {
    await Log.sync();
    return Log.create(log);
}
