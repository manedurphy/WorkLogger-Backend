import { Request } from 'express';

export interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}
