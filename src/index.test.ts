import { FiltersJS, Operation } from "./index";

test("search() should work", () => {
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
      card: ["jcb"]
    },
    {
      name: "Ken",
      gender: "Male",
      age: 45,
      card: ["visa"]
    },
    {
      name: "Boony",
      gender: "Male",
      age: 47,
      card: ["mastercard"]
    },
    {
      name: "Mike",
      gender: "Male",
      age: 67,
      card: ["visa"]
    }
  ];

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
        isMatching: (v: number) => 18 <= v && v <= 25
      },
      {
        key: "age",
        value: "25-50",
        isMatching: (v: number) => 25 <= v && v <= 50
      },
      { key: "age", value: ">50", isMatching: (v: number) => 50 < v }
    ]
  };

  const filtersJS = new FiltersJS(items, options);

  const { results, filters } = filtersJS.search({
    card: { values: ["jcb", "visa"], operation: Operation.Or },
    gender: "male",
    age: ["18-25", "25-50"]
  });

  expect(results).toEqual([
    {
      name: "Scot",
      gender: "Male",
      age: 18,
      card: ["jcb", "visa", "mastercard"]
    },
    {
      name: "Ken",
      gender: "Male",
      age: 45,
      card: ["visa"]
    }
  ]);

  expect(filters).toEqual({
    card: { mastercard: 3 },
    gender: { female: 3 },
    age: { ">50": 3 }
  });
});

test("search() should work with empty values", () => {
  const items = [
    {
      name: "Scot",
      gender: "Male",
      card: ["visa"]
    },
    {
      name: "Seana",
      gender: "Female",
      card: "jcb"
    },
    {
      name: "Ken",
      card: ["visa"]
    },
    {},
    null,
    undefined
  ];

  const options = {
    filters: [
      { key: "card", value: "jcb" },
      { key: "card", value: "visa" },
      { key: "gender", value: "male" },
      { key: "gender", value: "female" }
    ]
  };

  const filtersJS = new FiltersJS(items, options);

  const { results, filters } = filtersJS.search({
    card: ["jcb", "visa"],
    gender: ["male", "female"]
  });

  expect(results).toEqual([
    {
      name: "Scot",
      gender: "Male",
      card: ["visa"]
    },
    {
      name: "Seana",
      gender: "Female",
      card: "jcb"
    }
  ]);

  expect(filters).toEqual({});
});

test("search() should work with AND filters", () => {
  const items = [
    {
      name: "Scot",
      gender: "Male",
      card: ["jcb", "visa"]
    },
    {
      name: "Seana",
      gender: "Female",
      card: ["jcb", "visa"]
    },
    {
      name: "Ken",
      gender: "Male",
      card: ["visa"]
    },
    {
      name: "Boony",
      gender: "Male",
      card: ["jcb"]
    }
  ];

  const options = {
    filters: [
      { key: "card", value: "jcb" },
      { key: "card", value: "visa" },
      { key: "gender", value: "male" },
      { key: "gender", value: "female" }
    ]
  };

  const filtersJS = new FiltersJS(items, options);

  const { results, filters } = filtersJS.search({
    card: { values: ["jcb", "visa"], operation: Operation.And },
    gender: ["male"]
  });

  expect(results).toEqual([
    {
      name: "Scot",
      gender: "Male",
      card: ["jcb", "visa"]
    }
  ]);

  expect(filters).toEqual({
    gender: { female: 2 }
  });
});
