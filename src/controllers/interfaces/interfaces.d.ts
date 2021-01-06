import { User } from '../../models/User';

export interface AuthenticatedRequest extends Request {
  payload: {
    userInfo: User;
  };
  params: any;
  body: any;
}

// export interface TaskCreateRequest extends AuthenticatedRequest {
//   body
// }
