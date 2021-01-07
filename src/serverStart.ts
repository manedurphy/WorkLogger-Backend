import { Logger } from '@overnightjs/logger';
import 'reflect-metadata';
import app from './server';

const port = process.env.PORT || 5000;

export const server = app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
  const date = new Date();
  date.setDate(date.getDate() - (date.getDay() || 7));

  Logger.Imp(date.toString().slice(0, 15));

  const lastSunday = new Date();

  lastSunday.setDate(lastSunday.getDate() - (lastSunday.getDay() || 7) - 7);

  Logger.Warn(lastSunday.toString().slice(0, 15));
});

export default app;
