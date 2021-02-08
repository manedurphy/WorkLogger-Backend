import Task from '../../../models/Task';
import { TaskCreateDto } from '../../dtos/TaskCreateDto';

const task: TaskCreateDto = {
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
    dateAssigned: new Date(),
    dueDate: new Date(),
    UserId: 1,
};

export default async function () {
    await Task.sync();
    return Task.create(task);
}
