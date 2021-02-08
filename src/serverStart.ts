import { Logger } from '@overnightjs/logger';
import 'reflect-metadata';
import app from './server';

const port = process.env.PORT || 5000;

export const server = app.listen(port, () => {
    Logger.Info(`Server started on port ${port}...`);
});

export default app;
