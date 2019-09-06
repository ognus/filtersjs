# filtersjs

Simple faceted search solution for small JSON datasets.

## Installation

`yarn` or `npm install`

## Usage

```javascript
// import or require filtersjs
import { FiltersJS, Operation } from "filtersjs";

// data to filter
const items = [
  {
    name: "Scot",
    gender: "Male",
    age: 18,
    card: ["jcb", "visa", "mastercard"]
  },
  {
    name: "Seana",
    gender: "Female",
    age: 21,
    card: ["jcb", "visa"]
  },
  {
    name: "Ken",
    gender: "Male",
    age: 45,
    card: ["jcb", "visa"]
  },
  {
    name: "Boony",
    gender: "Male",
    age: 47,
    card: ["visa"]
  },
  {
    name: "Mike",
    gender: "Male",
    age: 67,
    card: ["jcb", "visa"]
  }
];

/**
 * Options object with filters definitions.
 * By default values are converted to lower case strings before match,
 * for custom comparator provide a isMatching(val) function.
 */
const options = {
  filters: [
    { key: "card", value: "jcb" },
    { key: "card", value: "mastercard" },
    { key: "card", value: "visa" },
    { key: "gender", value: "male" },
    { key: "gender", value: "female" },
    {
      key: "age",
      value: "18-25",
      isMatching: v => 18 <= v && v <= 25
    },
    {
      key: "age",
      value: "25-50",
      isMatching: v => 25 <= v && v <= 50
    },
    { key: "age", value: ">50", isMatching: v => 50 < v }
  ]
};

// create a FiltersJS instance
const filtersJS = new FiltersJS(items, options);

// call search by providing current filters values
const { results, filters } = filtersJS.search({
  card: { values: ["jcb", "visa"], operation: Operation.And },
  gender: "male",
  age: ["18-25", "25-50"]
});

// filtered results
console.log(results);
// Prints:
// {
//   name: "Scot",
//   gender: "Male",
//   age: 18,
//   card: ["jcb", "visa", "mastercard"]
// },
// {
//   name: "Ken",
//   gender: "Male",
//   age: 45,
//   card: ["jcb", "visa"]
// }

/**
 * Active filters with number of results for each filter (if it will be applied).
 * Can be used for basic facating and hiding filters that won't produce any results.
 */
console.log(filters);
// Prints:
// {
//   card: { mastercard: 3 },
//   gender: { female: 3 },
//   age: { ">50": 3 }
// }
```
