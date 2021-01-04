export class ValidationMessages {
  /** USERS */
  public static PASSWORDS_DO_NOT_MATCH =
    'Passwords do not match. Please try again.';
  public static FIRST_NAME = 'Must include first name';
  public static LAST_NAME = 'Must include last name';
  public static EMAIL = 'Invalid email';
  public static PASSWORD = 'Password must be at least 6 characters long';
  public static PASSWORD_MISSING = 'Please enter your password';

  /** TASKS */
  public static TASK_NAME: string = 'Task name is missing';
  public static PROJECT_NUMBER: string = 'Project number is missing';
  public static AVAILABLE_HOURS: string = 'Please enter available hours';
  public static HOURS_WORKED: string =
    'Please enter the numbers of hours worked';
  public static REVIEW_HOURS: string =
    'Please enter the number of review hours';
  public static NUMBER_OF_REVIEWS: string = 'Number of reviews is missing';
  public static HOURS_BIM: string = 'Hours required by BIM is missing';
}
