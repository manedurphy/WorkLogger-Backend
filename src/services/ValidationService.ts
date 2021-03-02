// import 'reflect-metadata';
import { Request } from 'express';
import { validationResult } from 'express-validator';
import { injectable } from 'inversify';
import { AuthenticatedRequest } from '../controllers/interfaces/authenticatedReq';

@injectable()
export class ValidationService {
    private _errorMessage = '';

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(message: string) {
        this._errorMessage = message;
    }

    public validateForm(req: Request | AuthenticatedRequest): boolean {
        const errors = validationResult(req);
        const errorsPresent = !errors.isEmpty();

        if (errorsPresent) {
            this._errorMessage = errors.array()[0].msg;
        }

        return errorsPresent;
    }
}
