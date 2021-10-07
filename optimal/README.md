# Optimal

[![Build Status](https://github.com/milesj/optimal/workflows/Build/badge.svg)](https://github.com/milesj/optimal/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/optimal.svg)](https://www.npmjs.com/package/optimal)
[![npm deps](https://david-dm.org/milesj/optimal.svg)](https://www.npmjs.com/package/optimal)

Optimal is a system for building and validating any value with typed schemas, and first-class
support for defined object structures, like options objects, configuration files, validation fields,
and many more. Optimal aims to provide a powerful API, with high performance, the lowest possible
filesize, and TypeScript-first support.

```ts
// Import schemas to build validators withs
import { array, string, number, optimal } from 'optimal';

// Define and validate values with individual schemas
const maxSizeSchema = number().positive().lte(10000);

maxSizeSchema.validate(1234);

// Or define an explicit shaped blueprint
const schema = optimal({
  name: string().notEmpty(),
  include: array().of(string()),
  exclude: array().of(string()),
  maxSize: maxSizeSchema
});

// Pass a full or partial object to validate
const options = schema.validate({ name: 'Optimal' });

// Which validates, builds, and returns the following object
{
  name: 'Optimal',
  include: [],
  exclude: [],
  maxSize: 10000,
}
```

## Features

- Zero dependencies, with a tree-shakable API.
- Powerful inferrence using a TypeScript first design.
- Runs in both Node.js and the browser.
- Smallest filesize: 5kB minified and gzipped!
- Immutable & fluent schema builder pattern.
- Recursively builds and validates nested structures.
- Supports common data types.
- Autofills missing fields with default values.
- Allows or restricts unknown fields.
- Mark fields as nullable or required.
- Handles logical operators AND, OR, and XOR.

## Requirements

- Node v12.17 (server)
- Edge, Chrome, Firefox, Safari (browser)

## Installation

```
yarn add optimal
```

## Documentation

[https://optimallib.dev](https://optimallib.dev)
