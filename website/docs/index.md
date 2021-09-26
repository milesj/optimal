---
title: Introduction
slug: /
---

Optimal is a system for building and validating defined object structures, like argument options,
configuration files, data bags, validation fields, and many more, using typed schemas.

- Recursively builds and validates nested structures.
- Supports common data types.
- Autofills missing fields with default values.
- Allows or restricts unknown fields.
- Mark fields as nullable, optional, or required.
- Handles logical operators AND, OR, and XOR.

```ts
import { array, string, number, optimal } from 'optimal';

// Define an explicit blueprint, and pass a partial object to validate
const options = optimal({
  name: string().notEmpty(),
  include: array().of(string()),
  exclude: array().of(string()),
  maxSize: number(10000).gte(0),
}).validate({ name: 'Optimal' });

// Which validates, builds, and returns the following object
{
  name: 'Optimal',
  include: [],
  exclude: [],
  maxSize: 10000,
}
```

## Requirements

- Node v12.17 (server)
- Edge, Chrome, Firefox, Safari (browser)

## Installation

```
yarn add optimal
```
