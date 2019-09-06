import { ISearchProvider, TTerm } from "./SearchProvider";
import { IDataProvider } from "./DataProvider";

export enum EOperation {
  And = "AND",
  Or = "OR"
}

export class Finder {
  constructor(
    private search: ISearchProvider,
    private data: IDataProvider,
    private operations: { [key: string]: EOperation }
  ) {}

  private isMatching(
    itemId: number,
    propertyKey: string,
    values: (string | number)[]
  ) {
    const operation = this.operations[propertyKey];

    if (operation === EOperation.And) {
      return values.every(value =>
        this.search.isMatching(itemId, propertyKey, value)
      );
    }

    return values.some(value =>
      this.search.isMatching(itemId, propertyKey, value)
    );
  }

  private getGroupedTerms(terms: TTerm[]) {
    const termsByKey: { [key: string]: (string | number)[] } = terms.reduce(
      (byKey, { key, value }) => {
        byKey[key] = byKey[key] || [];
        byKey[key].push(value);
        return byKey;
      },
      {}
    );

    return Object.entries(termsByKey);
  }

  find(terms: TTerm[]): IDataProvider {
    const grouped = this.getGroupedTerms(terms);

    return this.data.filter(([itemId]) => {
      return grouped.every(([key, values]) =>
        this.isMatching(itemId, key, values)
      );
    });
  }
}
