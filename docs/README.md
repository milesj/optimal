# Optimal

A system for building and validating defined object structures, like argument options, configuration
files, data bags, validation fields, and more! Runs checks in development and strips checks in
production using dead code elimination.

- Recursively builds and validates nested structures.
- Supports common data types.
- Autofills missing fields with default values.
- Allows or restricts unknown fields.
- Mark fields as nullable or required.
- Handles complex operators like AND, OR, and XOR.

```ts
// Pass a partial object to an explicit blueprint
const options = optimal(
  { name: 'Optimal' },
  {
    name: string().notEmpty(),
    include: array(string()),
    exclude: array(string()),
    maxSize: number(10000).gte(0),
  },
);

// Validates, builds, and returns the following object
const options = {
  name: 'Optimal',
  include: [],
  exclude: [],
  maxSize: 10000,
};
```

## Requirements

- Node 8.9 (server)
- IE 11+ (browser)

## Installation

```
yarn add optimal
// Or
npm install optimal
```
