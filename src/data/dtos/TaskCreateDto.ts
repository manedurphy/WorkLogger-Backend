import { ITaskCreateDto } from '../interfaces/ITaskCreateDto';

export class TaskCreateDto implements ITaskCreateDto {
    public constructor(
        public name: string,
        public projectNumber: number,
        public hoursAvailableToWork: number,
        public hoursWorked: number,
        public hoursRemaining: number,
        public notes: string | null,
        public numberOfReviews: number,
        public complete: boolean = false,
        public reviewHours: number,
        public hoursRequiredByBim: number,
        public dateAssigned: Date,
        public dueDate: Date,
        public UserId: number
    ) {}
}
