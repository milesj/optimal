---
title: Usage
---

Optimal supports individual value validation through reusable [schemas](./schemas.md), and advanced
functionality through the [`optimal()`](#optimal-validation) function. Choose either or both APIs to
satisfy your use cases!

## Optimal validation

The primary API for validating options objects, configuration files, databags, and many more, is
with the [`optimal()`](/api/optimal/function/optimal) function. This function accepts a
[blueprint](#blueprints) and an optional [options](/api/optimal/interface/OptimalOptions) object,
and returns a schema-like API. Internally this function is a [shape](./schemas.md#shapes), but it
provides additional functionality through options and TypeScript typings.

To understand this function, let's demonstrate it with an example. Say we have the following
interface and class, and we want to validate the options within the constructor.

```ts
interface PluginOptions {
	id: string;
	debug?: boolean;
	priority?: 'low' | 'normal' | 'high';
}

class Plugin {
	options: PluginOptions;

	constructor(options: PluginOptions) {
		this.options = options;
	}
}
```

We can do this by importing optimal, defining a blueprint, and calling the
[`.validate()`](/api/optimal/interface/Optimal#validate) method. Let's expand upon the example above
and provide annotations for what's happening.

```ts
// Import the optimal function and any schemas we require
import { bool, string, optimal } from 'optimal';

interface PluginOptions {
	// This field is required
	id: string;
	// While these 2 fields are optional
	debug?: boolean;
	priority?: 'low' | 'normal' | 'high';
}

class Plugin {
	// We wrap the type in `Required` since optimal ensures they all exist afer validation
	options: Required<PluginOptions>;

	constructor(options: PluginOptions) {
		// Instantiate optimal with a blueprint that matches the `PluginOptions` interface
		this.options = optimal(
			{
				// Mark this field as required to match the interface
				id: string().notEmpty().camelCase().required(),
				// Omit the required since these 2 fields are optional in the interface
				debug: bool(),
				priority: string('low').oneOf(['low', 'normal', 'high']),
			},
			{
				// Provide a unique name within error messages
				name: this.constructor.name,
			},
			// Immediately trigger validation and return a built object!
		).validate(options);
	}
}
```

Now when the plugin is instantiated, the `optimal()` function will be ran to return an object in the
shape of the blueprint. For example:

```ts
// { id: 'abc', debug: false, priority: 'low' }
new Plugin({ id: 'abc' }).options;

// { id: 'abc', debug: true, priority: 'low' }
new Plugin({ id: 'abc', debug: true }).options;

// { id: 'abc', debug: false, priority: 'high' }
new Plugin({ id: 'abc', priority: 'high' }).options;

// Throws an error for invalid `priority` value
new Plugin({ id: 'abc', priority: 'severe' }).options;

// Throws an error for an unknown filed
new Plugin({ id: 'abc', size: 123 }).options;
```

## Schema validation

Besides [`optimal()`](#optimal-validation), every schema supports a
[`.validate()`](/api/optimal/interface/Schema#validate) function that can be used to validate and
return a type casted value. [View all available schemas](./schemas.md).

```ts
import { string } from 'optimal';

const stringSchema = string();

stringSchema.validate(123); // fail
stringSchema.validate('abc'); // pass

// Or from the instance directly

string().notEmpty().validate(''); // fail
```

## Default values

Most schemas support a custom default value when being instantiated, which will be used as a
fallback when the field is not explicitly defined, or an explicit `undefined` is passed (unless
[undefinable](#undefinable-fields)). The default value must be the same type as the schema.

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

## Transforming values

All schemas support a chainable [`transform()`](/api/optimal/interface/CommonCriterias#transform)
method that can be used to transform the value. Transformation occurs in place, and _not_ at the
beginning or end of the validation process.

```ts
const textSchema = string()
	// Use smart quotes for typography
	.transform((value) => value.replace(/'/g, '‘').replace(/"/g, '“'))
	.notEmpty();

textSchema.validate(''); // throws
textSchema.validate("How's it going?"); // -> How‘s it going?
```

> Multiple tranformations can be declared by chaining multiple `transform()`s.

## Error messages

All failed validations throw an error with descriptive messages for a better user experience.
However, these messages are quite generic to support all scenarios, but can be customized with a
`message` object as the last argument.

```ts
// throws "String must be lower cased."
string().lowerCase().validate('FOO');

// throws "Please provide a lowercased value."
string().lowerCase({ message: 'Please provide a lowercased value.' }).validate('FOO');
```

## Nullable fields

Most schemas are _not_ nullable by default, which means `null` cannot be returned from a field being
validated. To accept and return `null` values, chain the `nullable()` method on a schema, inversely,
chain `notNullable()` to _not_ accept `null` values (resets).

```ts
const objectSchema = object().notNullable(); // default
const nullableObjectSchema = object().nullable();

objectSchema.validate(null); // throw error
nullableObjectSchema.validate(null); // -> null
```

> When nullable, the schema's return type is `T | null`.

## Undefinable fields

Unlike nullable above, all schemas by default do _not_ return `undefined`, as we fallback to the
default value when `undefined` is passed in. However, they are some scenarios where you want to
return `undefined`, and when this happens, the default value and most validation criteria is
completely ignored.

To accept and return `undefined` values, chain the `undefinable()` method on a schema, inversely,
chain `notUndefinable()` to _not_ accept `undefined` values (resets).

```ts
const numberSchema = number(123).notUndefinable(); // default
const undefinableNumberSchema = number(456).undefinable();

numberSchema.validate(undefined); // -> 123
undefinableNumberSchema.validate(undefined); // -> undefined
```

> When undefinable, the schema's return type is `T | undefined`.

## Required & optional fields

When a schema is marked as `required()`, it requires the field to be explicitly defined and passed
when validating a _shape_, otherwise it throws an error. To invert and reset the requirement, use
the `optional()` method.

```ts
const userSchema = shape({
	name: string().required().notEmpty(),
	age: number().positive(),
});

userSchema.validate({}); // throw error
userSchema.validate({ name: 'Bruce Wayne' }); // -> (shape)
```

This _does not_ change the typing and acceptance of `undefined` values, it simply checks property
existence. Use [undefinable fields](#undefinable-fields) for that functionality.

## Logical operators

[Shapes](./schemas.md#shapes) support the AND, OR, and XOR logical operators. When a schema is
configured with these operators and is validated _outside_ of a shape, they do nothing.

When [`and()`](/api/optimal/interface/CommonCriterias#and) is chained on a schema, it requires all
related fields to be defined.

```ts
const andSchema = shape({
	foo: string().and(['bar']),
	bar: number().and(['foo']),
});

andSchema.validate({ foo: 'abc' }); // throw error

// Requires both fields to be defined
andSchema.validate({ foo: 'abc', bar: 123 }); // -> (shape)
```

When [`or()`](/api/optimal/interface/CommonCriterias#or) is chained, it requires 1 or more of the
fields to be defined.

```ts
const orSchema = shape({
	foo: string().or(['bar', 'baz']),
	bar: number().or(['foo', 'baz']),
	baz: bool().or(['foo', 'bar']),
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
	foo: string().xor(['bar', 'baz']),
	bar: number().xor(['foo', 'baz']),
	baz: bool().xor(['foo', 'bar']),
});

xorSchema.validate({}); // throw error
xorSchema.validate({ foo: 'abc', baz: true }); // throw error

// Requires only 1 field to be defined
xorSchema.validate({ foo: 'abc' }); // -> (shape)
xorSchema.validate({ bar: 123 }); // -> (shape)
```

## Blueprints

A blueprint is an object of [schemas](./schemas.md) that define an exact structure to be returned
from [`optimal()`](/api/optimal/function/optimal) and [`shape()`](/api/optimal/function/optimal).
Each schema provides a default value to be used when a field of the same name is undefined or
missing.

```ts
import { Blueprint, number, string } from 'optimal';

interface User {
	id: number;
	name: string;
}

const user: Blueprint<User> = {
	id: number().positive(),
	name: string().notEmpty(),
};
```
