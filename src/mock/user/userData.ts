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
            active: false,
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
        invalid: {
            firstName: {
                lastName: 'User',
                email: 'testuser@mail.com',
                password: 'password',
                password2: 'password',
            },
            lastName: {
                firstName: 'Test',
                email: 'testuser@mail.com',
                password: 'password',
                password2: 'password',
            },
            email: {
                firstName: 'Test',
                lastName: 'User',
                password: 'password',
                password2: 'password',
            },
            password: {
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@mail.com',
                password: 'pass',
                password2: 'pass',
            },
        },
    },
};

export default userData;
