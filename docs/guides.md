# Guides

A few of guides on advanced usage, features, and concepts.

## Default Values

Most predicates accept a default value when being created, and this default value will be used when
the field is not explicitly defined. The default value must be of the same type as the predicate.

Furthermore, the default value can also be a factory function, which is passed the current struct,
and must return the same type. Extremely useful for conditional defaults.

```ts
optimal(
  {},
  {
    strict: bool(),
    level: string('low').oneOf(['low', 'high']),
    // Factory function
    level: string((struct) => (struct.strict ? 'high' : 'low')).oneOf(['low', 'high']),
  },
);
```

> The `func()` predicate does not support the factory approach.

The default value of a predicate can be accessed with the `default()` method.

## Nullable Fields

Excluding `instance()` and `func()` predicates, all other predicates are _not_ nullable by default.
This means `null` cannot be passed as a struct value to a field of the same name. To accept `null`
values, chain the `nullable()` method on a specific field. Inversely, to not accept `null` values,
use `notNullable()`.

```ts
optimal(
  {},
  {
    callback: func(handler).notNullable(),
    settings: object().nullable(),
  },
);
```

## Required Fields

When a field is marked as `required()` in a predicate, it requires the field to be explicitly passed
in the struct. Otherwise it throws an error.

```ts
optimal(
  {
    // Must be defined
    name: 'Optimal',
  },
  {
    name: string().required(),
  },
);
```

## Logical Operators

Optimal supports the AND, OR, and XOR logical operators. When `and()` is used on a predicate, it
requires all related fields to be defined.

```ts
optimal(
  {
    // Both must be defined
    foo: 'abc',
    bar: 123,
  },
  {
    foo: string().and('bar'),
    bar: number().and('foo'),
  },
);
```

When `or()` is used, it requires at minimum 1 of any of the fields to be defined.

```ts
optimal(
  {
    // At minimum 1 defined
    baz: true,
  },
  {
    foo: string().or('bar', 'baz'),
    bar: number().or('foo', 'baz'),
    baz: bool().or('foo', 'bar'),
  },
);
```

When `xor()` is used, it requires only 1 of any of the fields to be defined.

```ts
optimal(
  {
    // Only 1 defined
    bar: 123,
  },
  {
    foo: string().xor('bar', 'baz'),
    bar: number().xor('foo', 'baz'),
    baz: bool().xor('foo', 'bar'),
  },
);
```

## Predicate Validation

All of the examples in this documentation handle validation through the `optimal()` function, which
requires an object and blueprint ahead of time. But what if you just want to validate a number,
string, or array by itself? You can with the `validate(value)` method found on every predicate!

This method will run all checks on the provided value, throw an error for any failure, and return a
new value if applicable. It _will not_ inherit a default value if undefined is provided.

```ts
number().positive().integer().validate(12.34); // Invalid
```
