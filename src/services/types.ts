export interface PreShapeData {
    projectNumber: number;
    hours: number;
    day: number;
}

interface Day {
    hours: number;
    day: number;
}

export interface WeeklyData {
    [key: number]: Day[];
}
