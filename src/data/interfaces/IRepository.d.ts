export interface IRepository<TEntity> {
  Get(): Promise<void>;
  GetById(id: number): TEntity | undefined;
  Add(entity: TEntity): Promise<TEntity>;
}
