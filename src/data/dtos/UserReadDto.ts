export class UserReadDto {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;

  constructor(id: number, firstName: string, lastName: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
