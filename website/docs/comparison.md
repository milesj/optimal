---
title: Comparison
---

A comparison between other object/schema validation libraries in the JavaScript ecosystem.

### APIs

|                          | optimal |  yup   |   joi   |  zod   |
| :----------------------- | :-----: | :----: | :-----: | :----: |
| Async validation         |         |   ✅   |   ✅    |   ✅   |
| Custom error mesages     |   ✅    |        |         |   ✅   |
| Deep path validation     |         |   ✅   |         |        |
| Dependency count         |    0    |   7    |    5    |   0    |
| File size (unminified)   |  41kB   | 152kB  |  430kB  | 217kB  |
| File size (minified)     |  16kB   | 59.5kB | 145.1kB |  49kB  |
| File size (gzipped)      |  4.6kB  | 18.1kB | 41.8kB  | 11.2kB |
| Immutable schemas        |   ✅    |   ✅   |   ✅    |   ✅   |
| Lazy default values      |   ✅    |   ✅   |   ✅    |   ✅   |
| Lazy schemas             |   ✅    |   ✅   |         |   ✅   |
| Localization             |         |   ✅   |         |        |
| Native TypeScript        |   ✅    |        |         |   ✅   |
| Nullable fields          |   ✅    |   ✅   |         |   ✅   |
| Required/optional fields |   ✅    |   ✅   |   ✅    |   ✅   |
| Tree-shakable            |   ✅    |   ✅   |         |   ✅   |
| Type casting             |   ✅    |   ✅   |   ✅    |        |
| Undefined fields         |         |        |         |   ✅   |
| Value transformation     |         |   ✅   |   ✅    |   ✅   |

### Common methods

This functionality is available across all schema types, typically as chainable methods.

- 1️⃣ - Only supports these on objects/shapes.

|                | optimal | yup | joi | zod |
| :------------- | :-----: | :-: | :-: | :-: |
| and            |   1️⃣    |     | 1️⃣  | ✅  |
| any            |         |     |     | ✅  |
| custom handler |   ✅    |     | ✅  |     |
| default value  |   ✅    | ✅  | ✅  | ✅  |
| defined        |         | ✅  |     |     |
| deprecate      |   ✅    |     |     |     |
| nand           |         |     | 1️⃣  |     |
| never          |   ✅    |     | ✅  | ✅  |
| not nullable   |   ✅    |     |     |     |
| not required   |   ✅    | ✅  | ✅  |     |
| nullable       |   ✅    | ✅  |     | ✅  |
| only           |   ✅    |     | ✅  |     |
| or             |   1️⃣    |     | 1️⃣  |     |
| oxor           |         |     | 1️⃣  |     |
| required       |   ✅    | ✅  | ✅  |     |
| undefined      |   ✅    |     |     | ✅  |
| unknown        |         |     |     | ✅  |
| void           |         |     |     | ✅  |
| when           |   ✅    | ✅  | ✅  |     |
| xor            |   1️⃣    |     | 1️⃣  |     |

### Arrays

The `array()` schema for arrays.

|              | optimal | yup | joi | zod |
| :----------- | :-----: | :-: | :-: | :-: |
| filter       |         | ✅  |     |     |
| has          |         |     | ✅  |     |
| items schema |   ✅    |     | ✅  |     |
| length       |   ✅    |     | ✅  | ✅  |
| max          |         | ✅  | ✅  | ✅  |
| min          |         | ✅  | ✅  | ✅  |
| not empty    |   ✅    | ✅  | ✅  | ✅  |
| order        |         |     | ✅  |     |
| sort         |         |     | ✅  |     |
| unique       |         |     | ✅  |     |

### Binary

The `binary()` schema for binary/blob values.

|          | optimal ❌ | yup ❌ | joi | zod ❌ |
| :------- | :--------: | :----: | :-: | :----: |
| encoding |            |        | ✅  |        |
| length   |            |        | ✅  |        |
| max      |            |        | ✅  |        |
| min      |            |        | ✅  |        |

### Booleans

The `bool()` (or `boolean()`) schema for booleans.

|               | optimal | yup | joi | zod |
| :------------ | :-----: | :-: | :-: | :-: |
| falsy values  |         |     | ✅  |     |
| only false    |   ✅    |     |     |     |
| only true     |   ✅    |     |     |     |
| truthy values |         |     | ✅  |     |

### Class instances

The `instance()` (or `instanceof()`) schema for class instances.

- 1️⃣ - `joi` only supports these on `object.instance()`.

|             | optimal | yup ❌ | joi | zod |
| :---------- | :-----: | :----: | :-: | :-: |
| inheritance |   ✅    |        | 1️⃣  | ✅  |

### Dates

The `date()` schema for `Date`s.

|           | optimal | yup | joi | zod |
| :-------- | :-----: | :-: | :-: | :-: |
| after     |   ✅    | ✅  | ✅  |     |
| before    |   ✅    | ✅  | ✅  |     |
| between   |   ✅    |     |     |     |
| iso       |         |     | ✅  |     |
| timestamp |         |     | ✅  |     |

### Functions

The `func()` (or `function()`) schema for functions.

|            | optimal | yup ❌ | joi | zod |
| :--------- | :-----: | :----: | :-: | :-: |
| arity      |         |        | ✅  |     |
| args       |         |        |     | ✅  |
| implements |         |        |     | ✅  |
| return     |         |        |     | ✅  |

### Lazy

The `lazy()` schema for deferring evaluation, or recursive schemas.

|     | optimal | yup | joi ❌ | zod |
| :-- | :-----: | :-: | :----: | :-: |
| \*  |   ✅    | ✅  |        | ✅  |

### Numbers

The `number()` schema for numbers.

|            | optimal | yup | joi | zod |
| :--------- | :-----: | :-: | :-: | :-: |
| base       |         |     | ✅  |     |
| between    |   ✅    |     |     |     |
| float      |   ✅    |     |     |     |
| gt         |   ✅    | ✅  | ✅  | ✅  |
| gte        |   ✅    |     | ✅  | ✅  |
| integer    |   ✅    |     | ✅  | ✅  |
| lt         |   ✅    | ✅  | ✅  | ✅  |
| lte        |   ✅    |     | ✅  | ✅  |
| max        |   ✅    | ✅  | ✅  |     |
| min        |   ✅    | ✅  | ✅  |     |
| negative   |   ✅    | ✅  | ✅  | ✅  |
| not one of |         | ✅  |     |     |
| one of     |   ✅    | ✅  |     |     |
| precision  |         |     | ✅  |     |
| port       |         |     | ✅  |     |
| positive   |   ✅    | ✅  | ✅  | ✅  |
| rounding   |         | ✅  |     |     |
| sign       |         |     | ✅  |     |

### Objects / records

The `object()` schema for _indexed_ objects.

- For `joi` and `yup`, they don't support this type, see [shapes](#shape).
- For `zod`, this is a `record()`.

|               | optimal | yup ❌ | joi ❌ | zod |
| :------------ | :-----: | :----: | :----: | :-: |
| keys schema   |   ✅    |        |        |     |
| length        |   ✅    |        |        |     |
| not empty     |   ✅    |        |        |     |
| values schema |   ✅    |        |        | ✅  |

### Regex patterns

The `regex()` schema for `RegExp` inheritance.

- 1️⃣ - `joi` only supports these on `object.regex()`.

|             | optimal | yup ❌ | joi | zod ❌ |
| :---------- | :-----: | :----: | :-: | :----: |
| inheritance |   ✅    |        | 1️⃣  |        |

### Shapes

The `shape()` schema for _shaped_ objects.

- For `yup`, this is `object().shape()`.
- For `joi` and `zod`, this is `object()`.

|                 | optimal | yup | joi | zod |
| :-------------- | :-----: | :-: | :-: | :-: |
| exact / unknown |   ✅    | ✅  | ✅  | ✅  |
| extending       |         | ✅  | ✅  | ✅  |
| key rename      |         |     | ✅  |     |
| max             |         |     | ✅  |     |
| min             |         |     | ✅  |     |
| merge           |         |     |     | ✅  |
| omit            |         | ✅  |     | ✅  |
| pick            |         | ✅  |     | ✅  |
| with            |         |     | ✅  |     |
| without         |         |     | ✅  |     |

### Strings

The `string()` schema for strings.

|              | optimal | yup | joi | zod |
| :----------- | :-----: | :-: | :-: | :-: |
| alphanumeric |         |     | ✅  |     |
| base 64      |         |     | ✅  |     |
| camel case   |   ✅    |     |     |     |
| contains     |   ✅    |     |     |     |
| credit card  |         |     | ✅  |     |
| domain       |         |     | ✅  |     |
| email        |         | ✅  | ✅  | ✅  |
| hex          |         |     | ✅  |     |
| hostname     |         |     | ✅  |     |
| ip           |         |     | ✅  |     |
| kebab case   |   ✅    | ✅  |     |     |
| length       |   ✅    | ✅  | ✅  | ✅  |
| lower case   |   ✅    | ✅  | ✅  |     |
| matches      |   ✅    | ✅  | ✅  | ✅  |
| max          |         |     | ✅  | ✅  |
| min          |         |     | ✅  | ✅  |
| not empty    |   ✅    |     |     | ✅  |
| not one of   |         | ✅  |     |     |
| one of       |   ✅    | ✅  |     |     |
| pascal case  |   ✅    |     |     |     |
| snake case   |   ✅    |     |     |     |
| replace      |         |     | ✅  |     |
| trim         |         | ✅  |     |     |
| truncate     |         |     | ✅  |     |
| token        |         |     | ✅  |     |
| upper case   |   ✅    | ✅  | ✅  |     |
| uri          |         |     | ✅  |     |
| url          |         | ✅  |     | ✅  |
| uuid         |         | ✅  | ✅  | ✅  |

### Symbols

The `symbol()` schema for symbols.

|     | optimal ❌ | yup ❌ | joi | zod ❌ |
| :-- | :--------: | :----: | :-: | :----: |
| \*  |            |        | ✅  |        |

### Tuples

The `tuple()` schema for tuples (fixed arrays).

|                | optimal | yup ❌ | joi ❌ | zod |
| :------------- | :-----: | :----: | :----: | :-: |
| members schema |   ✅    |        |        | ✅  |

### Unions

The `union()` schema for unions.

|                | optimal | yup ❌ | joi ❌ | zod |
| :------------- | :-----: | :----: | :----: | :-: |
| options schema |   ✅    |        |        | ✅  |

### Other schemas

|             | optimal | yup | joi | zod |
| :---------- | :-----: | :-: | :-: | :-: |
| `any()`     |         |     | ✅  |     |
| `bigint()`  |         |     |     | ✅  |
| `enum()`    |         |     |     | ✅  |
| `literal()` |         |     |     | ✅  |
| `map()`     |         |     |     | ✅  |
| `promise()` |         |     |     | ✅  |
| `set()`     |         |     |     | ✅  |
