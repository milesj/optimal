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

```ts
optimal(
  {},
  {
    items: array(),
    extensions: array(string(), ['js']).notEmpty(),
  },
);
```

## Bool

The `bool(default?: boolean)` predicate verifies a value is a boolean. Defaults to `false` but can
be customized with the 1st argument.

```ts
optimal(
  {},
  {
    watch: bool(), // false
    debug: bool(true),
  },
);
```

## Custom

The `custom(cb: (value: any, struct: object) => void, default: any)` predicate verifies a value
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

## Number

The `number(default?: number)` predicate verifies a value is a number. Defaults to `0` but can be
customized with the 1st argument. Number builder supports the following additional methods:

- `between(min: number, max: number, inclusive?: boolean)` - Validate value is between 2 numbers.
  When `inclusive`, will compare against outer bounds, otherwise only compares between bounds.
- `gt(min: number)` - Validate the value is greater than the minimum.
- `gte(min: number)` - Validate the value is greater than or equal to the minimum.
- `lt(max: number)` - Validate the value is less than the maximum.
- `lte(max: number)` - Validate the value is less than or equal to the maximum.
- `oneOf(list: number[])` - Validate the value is one of the following numbers.

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
_cannot_ be customized.

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

- `contains(token: string, index?: number)` - Checks if the value contains the defined token.
  Supports an optional start index.
- `match(pattern: RegExp)` - Checks the value against a regex pattern.
- `notEmpty()` - Requires the string to not be empty.
- `oneOf(list: string[])` - Validate the value is one of the following strings.

```ts
optimal(
  {},
  {
    filename: string('[id].js').notEmpty(),
    target: string('dev').oneOf(['dev', 'prod', 'staging', 'qa']),
  },
);
```

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

> When using TypeScript, the type cannot be inferred automatically, so defaults to `any`. This can
> be overridden by explicitly defining the generic: `union<string | string[] | { path: string }>()`.
