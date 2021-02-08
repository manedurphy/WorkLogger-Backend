import User from './User';
import Task from './Task';
import ActivationPassword from './ActivationPassword';
import Log from './Log';

User.hasMany(Task);
User.hasOne(ActivationPassword);
Task.hasMany(Log);
User.hasMany(Log);
Task.belongsTo(User);
ActivationPassword.belongsTo(User);
Log.belongsTo(User);
Log.belongsTo(Task);
