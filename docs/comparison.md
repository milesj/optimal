|                      | optimal | yup | joi | zod |
| :------------------- | :-----: | :-: | :-: | :-: |
| Async validation     |         | ✅  | ✅  |     |
| Deep validation      |         | ✅  |     |     |
| Immutable schemas    |   ✅    | ✅  | ✅  |     |
| Lazy default values  |   ✅    | ✅  | ✅  |     |
| Lazy schemas         |   ✅    | ✅  |     |
| Localization         |         | ✅  |     |     |
| Native TypeScript    |   ✅    |     |     |     |
| Nullable fields      |   ✅    | ✅  |     |     |
| Optional fields      |   ✅    | ✅  | ✅  |     |
| Type casting         |   ✅    | ✅  | ✅  |     |
| Value transformation |         | ✅  | ✅  |     |

### Common

This functionality is available across all schema types.

- 1️⃣ - `joi` only supports these on `object()`.

|                | optimal | yup | joi | zod |
| :------------- | :-----: | :-: | :-: | :-: |
| and            |   ✅    |     | 1️⃣  |     |
| custom handler |   ✅    |     | ✅  |     |
| default value  |   ✅    | ✅  | ✅  |     |
| defined        |         | ✅  |     |     |
| deprecate      |   ✅    |     |     |     |
| nand           |         |     | 1️⃣  |     |
| never          |   ✅    |     | ✅  |     |
| not nullable   |   ✅    |     |     |     |
| not required   |   ✅    | ✅  | ✅  |     |
| nullable       |   ✅    | ✅  |     |     |
| only           |   ✅    |     | ✅  |     |
| or             |   ✅    |     | 1️⃣  |     |
| oxor           |         |     | 1️⃣  |     |
| required       |   ✅    | ✅  | ✅  |     |
| when           |   ✅    | ✅  | ✅  |     |
| xor            |   ✅    |     | 1️⃣  |     |

### Any

The `any()` schema for any values.

|         | optimal ❌ | yup ❌ | joi | zod |
| :------ | :--------: | :----: | :-: | :-: |
| allowed |            |        | ✅  |     |

### Array

The `array()` schema for arrays.

|              | optimal | yup | joi | zod |
| :----------- | :-----: | :-: | :-: | :-: |
| filter       |         | ✅  |     |     |
| has          |         |     | ✅  |     |
| items schema |   ✅    |     | ✅  |     |
| length       |   ✅    |     | ✅  |     |
| max          |         | ✅  | ✅  |     |
| min          |         | ✅  | ✅  |     |
| not empty    |   ✅    | ✅  | ✅  |     |
| order        |         |     | ✅  |     |
| sort         |         |     | ✅  |     |
| unique       |         |     | ✅  |     |

### Binary

The `binary()` schema for binary/blob values.

|          | optimal ❌ | yup ❌ | joi | zod |
| :------- | :--------: | :----: | :-: | :-: |
| encoding |            |        | ✅  |     |
| length   |            |        | ✅  |     |
| max      |            |        | ✅  |     |
| min      |            |        | ✅  |     |

### Boolean

The `bool()` (or `boolean()`) schema for booleans.

|               | optimal | yup | joi | zod |
| :------------ | :-----: | :-: | :-: | :-: |
| falsy values  |         |     | ✅  |     |
| only false    |   ✅    |     |     |     |
| only true     |   ✅    |     |     |     |
| truthy values |         |     | ✅  |     |

### Classes

The `instance()` schema for class instances.

- 1️⃣ - `joi` only supports these on `object.instance()`.

|             | optimal | yup ❌ | joi ❌ | zod |
| :---------- | :-----: | :----: | :----: | :-: |
| inheritance |   ✅    |        |   1️⃣   |     |

### Date

The `date()` schema for `Date`s.

|           | optimal | yup | joi | zod |
| :-------- | :-----: | :-: | :-: | :-: |
| after     |   ✅    | ✅  | ✅  |     |
| before    |   ✅    | ✅  | ✅  |     |
| between   |   ✅    |     |     |     |
| iso       |         |     | ✅  |     |
| timestamp |         |     | ✅  |     |

### Function

The `func()` schema for functions.

|       | optimal | yup ❌ | joi | zod |
| :---- | :-----: | :----: | :-: | :-: |
| arity |         |        | ✅  |     |

### Lazy

The `lazy()` schema for deferring evaluation.

|     | optimal | yup | joi ❌ | zod |
| :-- | :-----: | :-: | :----: | :-: |

### Number

The `number()` schema for numbers.

|            | optimal | yup | joi | zod |
| :--------- | :-----: | :-: | :-: | :-: |
| base       |         |     | ✅  |     |
| between    |   ✅    |     |     |     |
| float      |   ✅    |     |     |     |
| gt         |   ✅    | ✅  | ✅  |     |
| gte        |   ✅    |     | ✅  |     |
| integer    |   ✅    |     | ✅  |     |
| lt         |   ✅    | ✅  | ✅  |     |
| lte        |   ✅    |     | ✅  |     |
| max        |   ✅    | ✅  | ✅  |     |
| min        |   ✅    | ✅  | ✅  |     |
| negative   |   ✅    | ✅  | ✅  |     |
| not one of |         | ✅  |     |     |
| one of     |   ✅    | ✅  |     |     |
| precision  |         |     | ✅  |     |
| port       |         |     | ✅  |     |
| positive   |   ✅    | ✅  | ✅  |     |
| rounding   |         | ✅  |     |     |
| sign       |         |     | ✅  |     |

### Object

The `object()` schema for _indexed_ objects. For `joi` and `yup`, they don't support this type, see
[shapes](#shape).

|               | optimal | yup ❌ | joi ❌ | zod |
| :------------ | :-----: | :----: | :----: | :-: |
| keys schema   |   ✅    |        |        |     |
| length        |   ✅    |        |        |     |
| not empty     |   ✅    |        |        |     |
| values schema |   ✅    |        |        |     |

### Regex

The `regex()` schema for `RegExp` inheritance.

- 1️⃣ - `joi` only supports these on `object.regex()`.

|             | optimal | yup ❌ | joi ❌ | zod |
| :---------- | :-----: | :----: | :----: | :-: |
| inheritance |   ✅    |        |   1️⃣   |     |

### Shape

The `shape()` schema for _shaped_ objects. For `yup`, this is `object().shape()`.

|                 | optimal | yup | joi | zod |
| :-------------- | :-----: | :-: | :-: | :-: |
| exact / unknown |   ✅    | ✅  | ✅  |     |
| extending       |         | ✅  | ✅  |     |
| key rename      |         |     | ✅  |     |
| max             |         |     | ✅  |     |
| min             |         |     | ✅  |     |
| omit            |         | ✅  |     |     |
| pick            |         | ✅  |     |     |
| with            |         |     | ✅  |     |
| without         |         |     | ✅  |     |

### String

The `string()` schema for strings.

|              | optimal | yup | joi | zod |
| :----------- | :-----: | :-: | :-: | :-: |
| alphanumeric |         |     | ✅  |     |
| base 64      |         |     | ✅  |     |
| camel case   |   ✅    |     |     |     |
| contains     |   ✅    |     |     |     |
| credit card  |         |     | ✅  |     |
| domain       |         |     | ✅  |     |
| email        |         | ✅  | ✅  |     |
| hex          |         |     | ✅  |     |
| hostname     |         |     | ✅  |     |
| ip           |         |     | ✅  |     |
| kebab case   |   ✅    | ✅  |     |     |
| length       |   ✅    | ✅  | ✅  |     |
| lower case   |   ✅    | ✅  | ✅  |     |
| matches      |   ✅    | ✅  | ✅  |     |
| max          |         |     | ✅  |     |
| min          |         |     | ✅  |     |
| not empty    |   ✅    |     |     |     |
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
| url          |         | ✅  |     |     |
| uuid         |         | ✅  | ✅  |     |

### Symbol

The `symbol()` schema for symbols.

|     | optimal ❌ | yup ❌ | joi | zod |
| :-- | :--------: | :----: | :-: | :-: |

### Tuple

The `tuple()` schema for tuples (fixed arrays).

|                | optimal | yup ❌ | joi ❌ | zod |
| :------------- | :-----: | :----: | :----: | :-: |
| members schema |   ✅    |        |        |     |

### Union

The `union()` schema for unions.

|                | optimal | yup ❌ | joi ❌ | zod |
| :------------- | :-----: | :----: | :----: | :-: |
| options schema |   ✅    |        |        |     |
