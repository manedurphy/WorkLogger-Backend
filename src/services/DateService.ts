import { injectable } from 'inversify';
import { PreShapeData, WeeklyData } from './types';

@injectable()
export class DateService {
    public lastSunday: string;
    public nextSunday: string;

    public constructor() {
        this.lastSunday = this.getLocalSunday();
        this.nextSunday = this.getNextSunday();
    }

    public shapeWeeklyLogData(weeklyData: PreShapeData[]): WeeklyData {
        const data: WeeklyData = {};

        for (const logItem of weeklyData) {
            if (data[logItem.projectNumber] == null) {
                data[logItem.projectNumber] = [];
            }
            data[logItem.projectNumber].push({ hours: logItem.hours, day: logItem.day });
        }

        return data;
    }

    private getLocalSunday(day: Date = new Date()): string {
        const sunday = new Date(day);
        sunday.setDate(sunday.getDate() - sunday.getDay());

        const sundayOffset = sunday.getTimezoneOffset() * 60000;
        return new Date(sunday.getTime() - sundayOffset).toISOString().slice(0, 10);
    }

    private getNextSunday(): string {
        const d = new Date();
        d.setDate(d.getDate() + 7 - (d.getDay() % 7) + 1);

        return this.getLocalSunday(d);
    }
}
