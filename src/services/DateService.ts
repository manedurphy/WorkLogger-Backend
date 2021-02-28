import { injectable } from 'inversify';

@injectable()
export class DateService {
    public lastSunday: string;
    public nextSunday: string;

    public constructor() {
        this.lastSunday = this.getLocalSunday();
        this.nextSunday = this.getNextSunday();
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
