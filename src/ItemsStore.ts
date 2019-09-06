import { IDataProvider, FilterCallback, MapCallback } from "./DataProvider";

export class ItemsStore implements IDataProvider {
  protected itemsById: { [id: number]: object } = {};
  protected items: [number, object][] = [];

  constructor(items: [number, object][]) {
    this.items = items;
    this.itemsById = Object.fromEntries(items);
  }

  get(id: string | number) {
    return this.itemsById[id];
  }

  filter(precicate: FilterCallback) {
    return new ItemsStore(
      this.items.filter((itemWithId, idx) => precicate(itemWithId, idx, this))
    );
  }

  map(iterator: MapCallback) {
    return this.items.map((itemWithId, idx) => iterator(itemWithId, idx, this));
  }

  get length() {
    return this.items.length;
  }
}

export class MutableItemsStore extends ItemsStore {
  private lastItemId = 0;

  constructor(items: object[]) {
    super([]);
    items.forEach(item => this.add(item));
  }

  add(item: object) {
    if (item) {
      const id = ++this.lastItemId;
      this.itemsById[id] = item;
      this.items.push([id, item]);
      return id;
    }

    return -1;
  }
}
