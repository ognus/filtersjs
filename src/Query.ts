import { EOperation } from "./Finder";
import { TTerm } from "./SearchProvider";

type TQueryValue = {
  values: (string | number)[];
  operation: EOperation;
};

type TQueryItem = TQueryValue & {
  key: string;
};

type TQueryInput = TQueryValue | string | string[];

export type TQuery = { [key: string]: TQueryInput };

export class Query {
  public terms: TTerm[] = [];
  public values: { [key: string]: (string | number)[] } = {};
  public operations: { [key: string]: EOperation } = {};

  constructor(query: TQuery) {
    const items = this.getQueryItems(query);

    items.forEach(({ key, values, operation }) => {
      this.operations[key] = operation;
      this.values[key] = values;
      this.terms.push(...values.map(value => ({ key, value })));
    });
  }

  private isQueryValue(input: TQueryInput): input is TQueryValue {
    const state = input as TQueryValue;
    return !!(state.operation && state.values);
  }

  private getQueryValue(input: TQueryInput) {
    if (this.isQueryValue(input)) {
      return input;
    }

    const values = Array.isArray(input) ? input : [input];
    return { values, operation: EOperation.Or };
  }

  private getQueryItems(query: TQuery): TQueryItem[] {
    return Object.entries(query).map(([key, input]) => {
      const { values, operation } = this.getQueryValue(input);
      return { key, values, operation };
    });
  }
}
