interface UserValidationRepsonse {
  jwt: string;
  refreshToken: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserLoginResponseObject extends UserValidationRepsonse {}
export interface IUserRefreshTokenResponseObject
  extends UserValidationRepsonse {}

export interface IUserTokenValidResponseObject {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
