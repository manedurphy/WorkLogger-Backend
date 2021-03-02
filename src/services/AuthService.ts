import { injectable } from 'inversify';
import { UserReadDto } from '../data/dtos/UserReadDto';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

@injectable()
export class AuthService {
    public generateToken(user: UserReadDto): string {
        return jwt.sign(
            {
                userInfo: user,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXP },
        );
    }

    public generateRefreshToken(user: UserReadDto): string {
        return jwt.sign(
            {
                userInfo: user,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.REFRESH_EXP },
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public sendVerificationEmail(activationPassword: string, email: string) {
        const verificationLink = `${process.env.DOMAIN}/verify/${activationPassword}`;

        sgMail.setApiKey(process.env.SENDGRID_API as string);
        const msg = {
            to: process.env.TEST_EMAIL || email,
            from: process.env.LOGGER_EMAIL as string,
            subject: 'Verify your account',
            html: `<p>Click the link to verify your account: ${verificationLink}</p>`,
        };
        return sgMail.send(msg);
    }
}
