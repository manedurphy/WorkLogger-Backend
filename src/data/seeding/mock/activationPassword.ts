import ActivationPassword from '../../../models/ActivationPassword';

const activationPassword = {
    id: 1,
    password: '12345',
    UserId: 1,
};

export default async function () {
    await ActivationPassword.sync();
    return ActivationPassword.create(activationPassword);
}
