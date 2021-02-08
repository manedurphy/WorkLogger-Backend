export interface ITaskCreateDto {
    name: string;
    projectNumber: number;
    hoursAvailableToWork: number;
    hoursWorked: number;
    hoursRemaining: number;
    notes: string | null;
    numberOfReviews: number;
    complete: boolean;
    reviewHours: number;
    hoursRequiredByBim: number;
    dateAssigned: Date;
    dueDate: Date;
    UserId: number;
}
