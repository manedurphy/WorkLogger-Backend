export interface IRepository<TEntity> {
  Get(): Promise<TEntity[]>;
  GetById(id: number): Promise<TEntity | null>;
  Add(entity: TEntity): Promise<TEntity>;
}
