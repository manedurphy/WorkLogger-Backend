import { User } from '../../models/User';

export interface AuthenticatedRequest extends Request {
  payload: {
    userInfo: User;
  };
}
