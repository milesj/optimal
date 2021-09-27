# Optimal

A system for building and validating defined object structures, like argument options, configuration
files, data bags, validation fields, and more! Runs checks in development and strips checks in
production using dead code elimination.

- Recursively builds and validates nested structures.
- Supports common data types.
- Autofills missing fields with default values.
- Allows or restricts unknown fields.
- Mark fields as nullable, optional, or required.
- Handles logical operators AND, OR, and XOR.

```ts
import optimal, { array, string, number } from 'optimal';

// Pass a partial object and define an explicit blueprint
optimal(
  { name: 'Optimal' },
  {
    name: string().notEmpty(),
    include: array(string()),
    exclude: array(string()),
    maxSize: number(10000).gte(0),
  },
);

// Which validates, builds, and returns the following object
{
  name: 'Optimal',
  include: [],
  exclude: [],
  maxSize: 10000,
}
```

## Requirements

- Node 10 (server)
- IE 11+ (browser)

## Installation

```
yarn add optimal
```
