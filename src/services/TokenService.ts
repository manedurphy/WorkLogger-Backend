import { injectable } from 'inversify';
import { UserReadDto } from '../data/dtos/UserReadDto';
import jwt from 'jsonwebtoken';

@injectable()
export class TokenService {
  public GenerateToken(user: UserReadDto) {
    return jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXP }
    );
  }
}
