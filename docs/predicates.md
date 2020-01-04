# Predicates

A predicate is a factory function that returns a fluent type-specific builder interface. This
builder can be used to chain validation rules and define a default value. All builders support the
following methods:

- `and(...names: string[])` - Requires all of the additional fields by name to be defined.
- `custom(cb: (value: any, struct: object) => void)` - Trigger a custom handler which can optionally
  throw an error.
- `deprecate(message: string)` - Mark the field as deprecated. Logs the message to the console in
  development.
- `message(error: string)` - Set a custom error message that will override all validation error
  messages.
- `never()` - Field should never be used. Will error immediately and return an undefined value.
- `nullable()` - Mark the field as nullable and allow a `null` value.
- `notNullable()` - Mark the field as non-nullable and disallow a `null` value.
- `only()` - Field value must match the default value, otherwise will throw an error.
- `or(...names: string[])` - Requires at least 1 of the additional fields by name to be defined.
- `required()` - Mark the field as required. A value must be explicitly defined in the struct.
- `xor(...names: string[])` - Requires none of the additional fields by name to be defined.

> These predicates can be used to model any structure. For example, here's Optimal replicating a
> [Webpack configuration object](https://github.com/milesj/optimal/blob/master/tests/optimal.test.ts#L17).

## Array

The `array(predicate?: Builder | null, default?: any[])` predicate verifies a value is an array or
an array of a specific type by accepting a predicate. Defaults to `[]` but can be customized with
the 2nd argument. Array builder supports the following additional method:

- `notEmpty()` - Requires the array to not be empty.
- `sizeOf(length: number)` - Requires the array to be an exact length.

```ts
optimal(
  {},
  {
    items: array(),
    extensions: array(string(), ['js']).notEmpty(),
  },
);
```

## Blueprint

The `blueprint(default?: { [key: string]: Builder })` predicate verifies a value is an object that
maps properties to builder instances.

```ts
optimal(
  {
    settings: {
      name: string(),
      type: number(),
    },
  },
  {
    settings: blueprint(),
  },
);
```

> This works in a similar fashion to `shape()` but without the wrapping builder. It allows the
> object to be passed to other `optimal` calls.

## Boolean

The `bool(default?: boolean)` predicate verifies a value is a boolean. Defaults to `false` but can
be customized with the 1st argument. Boolean builder supports the following additional methods:

- `onlyFalse()` - Validate the value is only ever `false` (or undefined).
- `onlyTrue()` - Validate the value is only ever `true` (or undefined).

```ts
optimal(
  {},
  {
    watch: bool(), // false
    debug: bool(true),
  },
);
```

## Builder

The `builder()` predicate verifies a value is a builder instance. This is useful for composing
blueprints.

```ts
optimal(
  {
    value: string(),
  },
  {
    value: builder(),
  },
);
```

## Custom

The `custom(cb: (value: any, schema: Schema) => void, default: any)` predicate verifies a value
based on a callback. The 1st argument is the callback, which accepts the value to be validated, and
the struct object. The 2nd argument is the default value, which must be explicitly defined.

```ts
optimal(
  {},
  {
    path: custom(value => {
      if (!path.isAbsolute(value)) {
        throw new Error('Path must be absolute.');
      }
    }, process.cwd()),
  },
);
```

> When using TypeScript, the type is inferred based on the default value. This can be overridden by
> explicitly defining the generic: `custom<string>()`.

## Date

The `date()` predicate verifies a value is an instance of `Date`.

```ts
optimal(
  {},
  {
    timestamp: date(),
  },
);
```

## Function

The `func(default?: Function | null)` predicate verifies a value is a function. Defaults to `null`
but can be customized with the 1st argument.

```ts
optimal(
  {},
  {
    callback: func(),
    click: func(onClick),
  },
);
```

> This predicate is nullable by default.

## Instance

The `instance(contract?: Constructor<any>)` predicate verifies a value is an instance of a specific
class (passed as the 1st argument), or simply an instance of any class (no argument). Defaults to
`null` and _cannot_ be customized.

```ts
optimal(
  {},
  {
    plugin: instance(Plugin),
    instance: instance(),
  },
);
```

Since `instanceof` checks are problematic cross realm or cross module version, an optional `loose`
argument can be enabled as the 2nd argument: `instance(Plugin, true)`. This will compare constructor
names, which is brittle, but unblocks certain scenarios.

> This predicate is nullable by default.

## Number

The `number(default?: number)` predicate verifies a value is a number. Defaults to `0` but can be
customized with the 1st argument. Number builder supports the following additional methods:

- `between(min: number, max: number, inclusive?: boolean)` - Validate value is between 2 numbers.
  When `inclusive`, will compare against outer bounds, otherwise only compares between bounds.
- `float()` - Require a floating point / decimal number.
- `gt(min: number)` - Validate the value is greater than the minimum.
- `gte(min: number)` - Validate the value is greater than or equal to the minimum.
- `int()` - Require an integer.
- `lt(max: number)` - Validate the value is less than the maximum.
- `lte(max: number)` - Validate the value is less than or equal to the maximum.
- `negative()` - Validate the value is negative and not zero.
- `oneOf(list: number[])` - Validate the value is one of the following numbers.
- `positive()` - Validate the value is positive and not zero.

```ts
optimal(
  {},
  {
    maxSize: number(10000).lte(10000),
    minSize: number().gte(0), // 0
  },
);
```

## Object

The `object(predicate?: Builder | null, default?: { [key: string]: any })` predicate verifies a
value is a plain object or an object with all values of a specific type by accepting a predicate.
Defaults to `{}` but can be customized with the 2nd argument. Object builder supports the following
additional method:

- `notEmpty()` - Requires the object to not be empty.
- `sizeOf(length: number)` - Requires the object to have an exact number of properties.

```ts
optimal(
  {},
  {
    settings: object().notEmpty(),
    flags: object(bool()),
  },
);
```

## Regex

The `date()` predicate verifies a value is an instance of `RegExp`.

```ts
optimal(
  {},
  {
    pattern: regex(),
  },
);
```

## Shape

The `shape(shape: { [key: string]: Builder })` predicate verifies a value matches a specific object
shape, defined by a collection of properties to builders. Defaults to the structure of the shape and
_cannot_ be customized. Shape builder supports the following additional method:

- `exact()` - Requires the object to be exact. Unknown fields will error.

```ts
optimal(
  {},
  {
    image: shape({
      name: string().notEmpty(),
      path: string(),
      type: string('png'),
      relative: bool(),
    }),
  },
);
```

## String

The `string(default?: string)` predicate verifies a value is a string. Defaults to an empty string
(`''`) but can be customized with the 1st argument. String builder supports the following additional
methods:

- `camelCase()` - Validate the value is in camel case (`fooBarBaz`). Must start with a lowercase
  character and contain at minimum 2 characters.
- `contains(token: string, index?: number)` - Validate the value contains the defined token.
  Supports an optional start index.
- `kebabCase()` - Validate the value is in kebab case (`foo-bar-baz`). Must separate words with a
  dash and contain at minimum 2 characters.
- `lowerCase()` - Validate the value is lower cased.
- `match(pattern: RegExp)` - Validate the value against a regex pattern.
- `notEmpty()` - Requires the value to not be empty.
- `oneOf(list: string[])` - Validate the value is one of the following strings.
- `pascalCase()` - Validate the value is in pascal case (`FooBarBaz`). Must start with an uppercase
  character and contain at minimum 2 characters.
- `sizeOf(length: number)` - Requires the string to be an exact length.
- `snakeCase()` - Validate the value is in snake case (`foo_bar_baz`). Must separate words with an
  underscore and contain at minimum 2 characters.
- `upperCase()` - Validate the value is upper cased.

```ts
optimal(
  {},
  {
    filename: string('[id].js').notEmpty(),
    target: string('dev').oneOf(['dev', 'prod', 'staging', 'qa']),
  },
);
```

## Tuple

A tuple is an array-like structure with a defined set of items, each with their own unique type. The
`tuple(predicates: Builder[])` predicate will validate each item and return an array of the same
length and types. Defaults to the structure of the tuple and _cannot_ be customized.

```ts
type Record = [number, string]; // ID, name

optimal(
  {},
  {
    record: tuple<Record>([
      number()
        .gt(0)
        .required(),
      string().notEmpty(),
    ]),
  },
);
```

> When using TypeScript, a generic type is required for builders to type correctly. Furthermore, the
> builder only supports a max length of 5 items.

## Union

The `union(predicates: Builder[], default: any)` predicate verifies a value against a list of
possible values. The 1st argument is a list of predicates to compare against. The 2nd argument is
the default value, which must be explicitly defined.

```ts
optimal(
  {},
  {
    source: union(
      [
        string(),
        array(string()),
        shape({
          path: string(),
        }),
      ],
      './src',
    ),
  },
);
```

Unions support multiple builders of the same type in unison, and the first one that passes
validation will be used.

```ts
optimal(
  {},
  {
    source: union([object(number()), object(string())], {}),
  },
);
```

Unions also support objects and shapes in unison. However, when using this approach, be sure that
shapes are listed first so that they validate their shape early and exit the validation process.

```ts
optimal(
  {},
  {
    source: union(
      [
        shape({
          path: string(),
        }),
        object(number()),
      ],
      {},
    ),
  },
);
```

> When using TypeScript, the type cannot be inferred automatically, so defaults to `any`. This can
> be overridden by explicitly defining the generic: `union<string | string[] | { path: string }>()`.
