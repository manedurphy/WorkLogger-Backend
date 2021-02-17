export class HttpResponse {
    /** USERS */
    public static USER_EXISTS =
        'User with this email already exists. Please try a different one.';
    public static USER_NOT_FOUND = 'User with this email was not found.';
    public static USER_NOT_VERIFIED = 'This account has not been verified.';
    public static INVALID_CREDENTIALS =
        'Invalid credentials. Please try again.';
    public static USER_CREATED =
        'User created! Please check your email to verify your account.';
    public static USER_ACTIVATED =
        'Your account has been activated. You may not sign in.';

    /** ACTIVATION PASSWORDS */
    public static INVALID_PASSWORD =
        'Invalid link. Account could not be verified.';

    /** TASKS */
    public static TASK_EXISTS = 'Task with that project number already exists.';
    public static TASK_NOT_FOUND = 'Task not found.';
    public static TASK_UPDATE = 'Task updated!';
    public static TASK_COMPLETE = 'Task complete!';
    public static TASK_INCOMPLETE = 'Task marked as incomplete';
    public static TASK_CREATED = 'Task created!';
    public static TASK_DELETED = 'Task deleted!';

    /** LOG */
    public static LOG_UPDATED = 'Log updated!';

    /** UNAUTHORIZED */
    public static UNAUTHORIZED = 'Unauthorized access. Please log in.';
}
