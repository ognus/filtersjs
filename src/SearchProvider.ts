export type TTerm = {
  key: string;
  value: string | number;
};

export type TMatchingFunction = (value: string | number) => boolean;

export type TFilter = TTerm & {
  isMatching?: TMatchingFunction;
};

export interface ISearchProvider {
  isMatching: (
    id: string | number,
    property: string,
    valueToMatch: string | number
  ) => boolean;
  getTerms: () => TTerm[];
}
