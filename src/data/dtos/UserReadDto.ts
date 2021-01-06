export class UserReadDto {
  public constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string
  ) {}
}
