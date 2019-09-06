import { IDataProvider } from "./DataProvider";
import {
  ISearchProvider,
  TTerm,
  TMatchingFunction,
  TFilter
} from "./SearchProvider";

function defaultMatchingFunction(value: string | number) {
  return (
    new String(this.value.toLowerCase()).toLowerCase() ===
    new String(value).toLowerCase()
  );
}

class FilterOption implements TTerm {
  private itemKey: string;
  private optionValue: string | number;
  private isMatchingFn: TMatchingFunction;

  constructor(
    itemKey: string,
    optionValue: string | number,
    isMatchingFn?: TMatchingFunction
  ) {
    this.itemKey = itemKey;
    this.optionValue = optionValue;
    this.isMatchingFn = isMatchingFn || defaultMatchingFunction.bind(this);
  }

  private getValues(item = {}) {
    const value = item[this.itemKey];
    return Array.isArray(value) ? value : [value];
  }

  isMatching(item: object) {
    return this.getValues(item).some(value => this.isMatchingFn(value));
  }

  get value() {
    return this.optionValue;
  }

  get key() {
    return this.itemKey;
  }
}

export class IndexStore implements ISearchProvider {
  private index: {
    [itemKey: string]: { [optionValue: string]: IDataProvider };
  } = {};
  private options: FilterOption[] = [];

  constructor(private items: IDataProvider) {}

  add({ key, value, isMatching }: TFilter) {
    const option = new FilterOption(key, value, isMatching);
    this.options.push(option);
    this.index[key] = this.index[key] || {};
    this.index[key][value] = this.items.filter(([, item]) =>
      option.isMatching(item)
    );
  }

  isMatching(
    itemId: string | number,
    propertyKey: string,
    optionValue: string | number
  ) {
    return !!this.index[propertyKey][optionValue].get(itemId);
  }

  getTerms(): TTerm[] {
    return this.options;
  }
}
