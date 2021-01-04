import { validationResult } from 'express-validator';
import { injectable } from 'inversify';
import { AuthenticatedRequest } from '../controllers/interfaces/interfaces';

@injectable()
export class TaskService {
  private _errorMessage: string = '';

  get errorMessage() {
    return this._errorMessage;
  }

  public Validate(req: AuthenticatedRequest): boolean {
    const errors = validationResult(req);
    const errorsPresent = !errors.isEmpty();

    if (errorsPresent) {
      this._errorMessage = errors.array()[0].msg;
    }

    return errorsPresent;
  }
}
