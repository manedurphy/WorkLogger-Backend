import User from '../../../models/User';
import { hash } from 'bcrypt';

const admin = {
    firstName: process.env.ADMIN_FIRST as string,
    lastName: process.env.ADMIN_LAST as string,
    email: process.env.ADMIN_EMAIL as string,
    active: true,
    password: '',
};

export default async function (): Promise<User> {
    await User.sync();
    admin.password = await hash(process.env.ADMIN_PASSWORD as string, 12);
    return User.create(admin);
}
