---
title: Usage
---

Most functionality is handled through a single function, `optimal()`, which requires a
[struct](#struct), [blueprint](#blueprint), and optional configuration [options](#options).

To understand its power, lets define a class that accepts an options object in the constructor.

```ts
import { optimal, bool, string } from 'optimal';

interface PluginOptions {
	debug: boolean;
	priority: 'low' | 'normal' | 'high';
}

class Plugin {
	options: PluginOptions;

	constructor(options: Partial<PluginOptions> = {}) {
		this.options = optimal({
			debug: bool(),
			priority: string('low').oneOf(['low', 'normal', 'high']),
		}).validate(options);
	}
}
```

When the plugin is instantiated, the `optimal()` function will be ran to return an object in the
shape of the blueprint. For example:

```ts
// { debug: false, priority: 'low' }
new Plugin().options;

// { debug: true, priority: 'low' }
new Plugin({ debug: true }).options;

// { debug: false, priority: 'high' }
new Plugin({ priority: 'high' }).options;

// Throws an error for invalid `priority` value
new Plugin({ priority: 'severe' }).options;

// Throws an error for an unknown filed
new Plugin({ size: 123 }).options;
```

## Struct

A struct is a partial plain object that will be validated against the blueprint. Undefined or
missing fields will be replaced with default values from the blueprint.

> For documentation purpose's, this argument will be referred to as "struct".

## Blueprint

The blueprint is an object of [schemas](./schemas.md) that define an exact structure to be returned
from `optimal()`. Each schema defines a default value to be used when a struct field of the same
name is undefined or missing . Furthermore, it provides a fluent interface for adding rules to be
ran during the validation process.

## Options

The following options can be passed to the 3rd argument.

- `file` (string) - Include a filename in validation error messages. Can be used in conjunction with
  `name`.
- `name` (string) - Include a unique identifier in validation error messages. Can be used in
  conjunction with `file`.
- `unknown` (bool) - Allow unknown fields to be passed within the struct. Otherwise, an error will
  be thrown.

```ts
optimal(
	{},
	{},
	{
		file: 'package.json',
		name: 'PackageLoader',
		unknown: true,
	},
);
```

## Validating values

## Default values

Most schemas support a custom default value when being instantiated, which will be used as a
fallback when the field is not explicitly defined, or an explicit `undefined` is passed. The default
value must be the same type as the schema.

```ts
const severitySchema = string('low').oneOf(['low', 'high']);

severitySchema.validate(undefined); // -> low
severitySchema.validate('high'); // -> high
```

Furthermore, the default value can also be a function that returns a value. This is useful for
deferring execution, or avoiding computation heavy code. This function is passed an object path for
the field being validated, the current depth object, and the entire object.

```ts
const dateSchema = date(() => new Date(2020, 1, 1));
```

> The [`func()`](./schemas.md#functions) schema must _always_ use the factory pattern for defining a
> default value, otherwise, the default function will be executed inadvertently.

## Error messages

All failed validations throw an error with descriptive messages for a better user experience.
However, these messages are quite generic to support all scenarios, but can be customized with a
`message` object as the last argument.

```ts
// throw "String must be lower cased."
string().lowerCase().validate('FOO');

// throw "Please provide a lowercased value."
string().lowerCase({ message: 'Please provide a lowercased value.' }).validate('FOO');
```

## Nullable fields

Excluding [`instance()`](./schemas.md#class-instances), all schemas are _not_ nullable by default.
This means `null` cannot be passed as a value to a field being validated. To accept `null` values,
chain the `nullable()` method on a schema, inversely, chain `notNullable()` to _not_ accept `null`
values.

```ts
const objectSchema = object().notNullable(); // default
const nullableObjectSchema = object().nullable();

objectSchema.validate(null); // throw error
nullableObjectSchema.validate(null); // -> null
```

## Required fields

When a schema is marked as `required()`, it requires the field to be explicitly defined and passed
when validating a _shape_, otherwise it throws an error. This _does not_ change the typing and
acceptance of `undefined` values, it simply checks existence.

```ts
const userSchema = shape({
	name: string().required().notEmpty(),
	age: number().positive(),
});

userSchema.validate({}); // throw error
userSchema.validate({ name: 'Bruce Wayne' }); // -> (shape)
```

## Logical operators

[Shapes](./schemas.md#shapes) support the AND, OR, and XOR logical operators. When a schema is
configured with these operators and is validated _outside_ of a shape, they do nothing.

When [`and()`](/api/optimal/interface/CommonCriterias#and) is chained on a schema, it requires all
related fields to be defined.

```ts
const andSchema = shape({
	foo: string().and('bar'),
	bar: number().and('foo'),
});

andSchema.validate({ foo: 'abc' }); // throw error

// Requires both fields to be defined
andSchema.validate({ foo: 'abc', bar: 123 }); // -> (shape)
```

When [`or()`](/api/optimal/interface/CommonCriterias#or) is chained, it requires 1 or more of the
fields to be defined.

```ts
const orSchema = shape({
	foo: string().or('bar', 'baz'),
	bar: number().or('foo', 'baz'),
	baz: bool().or('foo', 'bar'),
});

orSchema.validate({}); // throw error

// Requires at least 1 field to be defined
orSchema.validate({ foo: 'abc' }); // -> (shape)
orSchema.validate({ bar: 123 }); // -> (shape)
orSchema.validate({ foo: 'abc', baz: true }); // -> (shape)
```

When [`xor()`](/api/optimal/interface/CommonCriterias#xor) is chained, it requires _only_ 1 of the
fields to be defined.

```ts
const xorSchema = shape({
	foo: string().xor('bar', 'baz'),
	bar: number().xor('foo', 'baz'),
	baz: bool().xor('foo', 'bar'),
});

xorSchema.validate({}); // throw error
xorSchema.validate({ foo: 'abc', baz: true }); // throw error

// Requires only 1 field to be defined
xorSchema.validate({ foo: 'abc' }); // -> (shape)
xorSchema.validate({ bar: 123 }); // -> (shape)
```
