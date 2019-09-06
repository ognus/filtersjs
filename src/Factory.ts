import { Finder, EOperation } from "./Finder";
import { IndexStore } from "./IndexStore";
import { MutableItemsStore } from "./ItemsStore";
import { IDataProvider } from "./DataProvider";
import { ISearchProvider, TFilter } from "./SearchProvider";

export class Factory {
  private dataStore: IDataProvider;

  constructor(items: object[]) {
    this.dataStore = new MutableItemsStore(items);
  }

  getSearchProvider(filters: TFilter[]): ISearchProvider {
    const index = new IndexStore(this.dataStore);
    filters.forEach(filter => index.add(filter));
    return index;
  }

  getFinder(index: ISearchProvider, operations: { [key: string]: EOperation }) {
    return new Finder(index, this.dataStore, operations);
  }
}
