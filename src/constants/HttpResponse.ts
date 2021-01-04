export class HttpResponse {
  /** USERS */
  public static USER_EXISTS = 'User already exists';
  public static USER_NOT_FOUND = 'User not found';
  public static USER_NOT_VERIFIED = 'This account has not been verified';
  public static INVALID_CREDENTIALS = 'Invalid credentials';

  /** ACTIVATION PASSWORDS */
  public static INVALID_PASSWORD =
    'Invalid link. Account could not be verified';

  /** TASKS */
  public static TASK_EXISTS = 'Task with that project number already exists';
}
