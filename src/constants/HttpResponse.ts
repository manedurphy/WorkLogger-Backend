export class HttpResponse {
    /** USERS */
    public static USER_EXISTS: string = 'User with this email already exists. Please try a different one.';
    public static USER_NOT_FOUND: string = 'User with this email was not found.';
    public static USER_NOT_VERIFIED: string = 'This account has not been verified.';
    public static INVALID_CREDENTIALS: string = 'Invalid credentials. Please try again.';
    public static USER_CREATED: string = 'User created! Please check your email to verify your account.';
    public static USER_ACTIVATED: string = 'Your account has been activated. You may now sign in.';

    /** ACTIVATION PASSWORDS */
    public static INVALID_PASSWORD: string = 'Invalid link. Account could not be verified.';

    /** TASKS */
    public static TASK_EXISTS: string = 'Task with that project number already exists.';
    public static TASK_NOT_FOUND: string = 'Task not found.';
    public static TASKS_NOT_FOUND: string = 'Tasks not found';
    public static TASK_UPDATE: string = 'Task updated!';
    public static TASK_COMPLETE: string = 'Task complete!';
    public static TASK_INCOMPLETE: string = 'Task marked as incomplete';
    public static TASK_CREATED: string = 'Task created!';
    public static TASK_DELETED: string = 'Task deleted!';

    /** LOG */
    public static LOG_UPDATED: string = 'Log updated!';
    public static LOG_ITEM_DELETED: string = 'Log item deleted!';
    public static LOG_NO_DELETE: string = 'Cannot delete only log item';
    public static LOG_NOT_FOUND: string = 'Log for this task not found';
    public static LOG_ITEM_NOT_FOUND: string = 'Log item not found';
    public static LOG_WEEKLY_NOT_FOUND: string = 'No records available for this week';

    /** UNAUTHORIZED */
    public static UNAUTHORIZED: string = 'Unauthorized access. Please log in.';

    /** SERVER ERROR */
    public static SERVER_ERROR: string = 'Internal server error';
}
