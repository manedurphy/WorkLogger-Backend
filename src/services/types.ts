export interface PreShapeData {
    projectNumber: number;
    hours: string;
    day: number;
}

interface Day {
    hours: string;
    day: number;
}

export interface WeeklyData {
    [key: number]: Day[];
}
