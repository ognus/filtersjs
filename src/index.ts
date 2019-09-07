import { EOperation } from "./Finder";
import { Factory } from "./Factory";
import { ISearchProvider, TFilter } from "./SearchProvider";
import { TQuery, Query } from "./Query";

type TOptions = {
  filters: TFilter[];
};

export const Operation = EOperation;

export class FiltersJS {
  private factory: Factory;
  private index: ISearchProvider;

  constructor(items: object[], { filters }: TOptions) {
    this.factory = new Factory(items);
    this.index = this.factory.getSearchProvider(filters);
  }

  private getTerms({ values }: Query) {
    return this.index
      .getTerms()
      .filter(({ key, value }) => !(values[key] || []).includes(value));
  }

  search(params: TQuery) {
    const query = new Query(params);
    const { terms, operations } = query;

    const finder = this.factory.getFinder(this.index, operations);
    const results = finder.find(terms);

    const filters = this.getTerms(query).reduce((acc, term) => {
      const termResults = finder.find([...terms, term]);
      if (termResults.length) {
        acc[term.key] = acc[term.key] || {};
        acc[term.key][term.value] = termResults.length;
      }
      return acc;
    }, {});

    return {
      results: results.map(([, item]) => item),
      filters
    };
  }
}
