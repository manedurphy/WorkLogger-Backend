import { validationResult } from 'express-validator';
import { injectable } from 'inversify';
import { ValidationService } from './ValidationService';

@injectable()
export class TaskService extends ValidationService {
  public constructor() {
    super();
  }
}
