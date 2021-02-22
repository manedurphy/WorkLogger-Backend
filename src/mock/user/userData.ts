const userData = {
    create: {
        active: {
            id: 1,
            firstName: 'Active',
            lastName: 'User',
            email: 'activeuser@mail.com',
            password: 'password',
            active: true,
        },
        inactive: {
            id: 1,
            firstName: 'Not',
            lastName: 'Active',
            email: 'notactive@mail.com',
            password: 'password',
            active: true,
        },
    },
    login: {
        success: {
            email: 'testuser@mail.com',
            password: 'password',
        },
        fail: {
            email: 'testuser@mail.com',
            password: 'passwords',
        },
        inactive: {
            email: 'notactive@mail.com',
            password: 'password',
        },
    },
    register: {
        success: {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@mail.com',
            password: 'password',
            password2: 'password',
        },
        fail: {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@mail.com',
            password: 'password',
            password2: 'passwordss',
        },
        inactive: {
            firstName: 'Not',
            lastName: 'Active',
            email: 'notactive@mail.com',
            password: 'password',
            password2: 'password',
        },
    },
};

export default userData;
