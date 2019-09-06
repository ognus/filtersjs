type Item = object;

type WithId = [number, Item];

export type FilterCallback = (
  item: WithId,
  idx: number,
  array: IDataProvider
) => boolean;

export type MapCallback = (
  item: WithId,
  idx: number,
  array: IDataProvider
) => any;

export interface IDataProvider {
  length: number;
  get: (id: string | number) => Item;
  filter: (cb: FilterCallback) => IDataProvider;
  map: (cb: MapCallback) => any[];
}
