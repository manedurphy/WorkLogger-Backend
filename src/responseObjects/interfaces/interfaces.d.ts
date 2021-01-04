export interface IUserLoginResponseObject {
  jwt: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserTokenValidResponseObject {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
