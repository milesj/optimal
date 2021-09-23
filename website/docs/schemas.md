---
title: Schemas
---

A schema is a factory function that returns a fluent and typed builder interface. This builder can
be used to chain validation rules, define a default value, parse values, and more!

All schemas support methods found on the [`CommonCriterias`](/api/optimal/interface/CommonCriterias)
interface.

## Array

The [`array()`](/api/optimal/function/array) schema verifies a value is an array, or an array _of_ a
specific type. For undefined values, an empty array (`[]`) is returned, which can be customized with
the 1st argument.

```ts
import { array, string } from 'optimal';

const anyArray = array();

anyArray.validate([]); // pass
anyArray.validate([1, 2, 3]); // pass
anyArray.validate(['a', 'b', 'c']); // pass

const stringArray = array().of(string()).notEmpty();

stringArray.validate([]); // fail
stringArray.validate([1, 2, 3]); // fail
stringArray.validate(['a', 'b', 'c']); // pass
```

Array schemas support all methods found on the [`ArraySchema`](/api/optimal/interface/ArraySchema)
interface.

## Blueprint

The [`blueprint()`](/api/optimal/function/blueprint) schema verifies a value is an object that maps
properties to schema instances. This schema is useful for composition based APIs.

```ts
import { blueprint } from 'optimal';

blueprint().validate({
	name: string(),
	type: number(),
});
```

## Boolean

The [`bool()`](/api/optimal/function/bool) schema verifies a value is a boolean. For undefined
values, `false` is returned, which can be customized with the 1st argument.

```ts
import { bool } from 'optimal';

const anyBool = bool();

anyBool.validate(true); // pass
anyBool.validate(false); // pass
anyBool.validate(123); // fail

const falsyBool = bool().onlyFalse();

falsyBool.validate(true); // fail
falsyBool.validate(false); // pass
```

Boolean schemas support all methods found on the
[`BooleanSchema`](/api/optimal/interface/BooleanSchema) interface.

## Custom

The [`custom()`](/api/optimal/function/custom) schema verifies a value based on a user-provided
callback. This callback receives the current value to validate, an object path, and validation
options (which includes any root and current objects).

By default this schema has no default value (returns `undefined`), but this can be customized with
the 2nd argument.

```ts
import path from 'path';
import { custom } from 'optimal';

const pathLike = custom((value) => {
	if (!path.isAbsolute(value)) {
		throw new Error('Path must be absolute.');
	}
}, process.cwd());

pathLike.validate('/absolute/path'); // pass
pathLike.validate('../relative/path'); // fail
```

Custom schemas support all methods found on the
[`CustomSchema`](/api/optimal/interface/CustomSchema) interface.

> When using TypeScript, the type is inferred based on the default value. This can be overridden by
> explicitly defining the generic: `custom<string>()`.

## Date

The `date()` schema verifies a value is an instance of `Date`.

```ts
optimal(
	{},
	{
		timestamp: date(),
	},
);
```

## Function

The `func(default?: Function | null)` schema verifies a value is a function. Defaults to `null` but
can be customized with the 1st argument.

```ts
optimal(
	{},
	{
		callback: func(),
		click: func(onClick),
	},
);
```

> This schema is nullable by default.

## Instance

The `instance(contract?: Constructor<any>)` schema verifies a value is an instance of a specific
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

> This schema is nullable by default.

## Number

The `number(default?: number)` schema verifies a value is a number. Defaults to `0` but can be
customized with the 1st argument. Number schema supports the following additional methods:

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

The `object(schema?: Schema | null, default?: { [key: string]: any })` schema verifies a value is a
plain object or an object with all values of a specific type by accepting a schema. Defaults to `{}`
but can be customized with the 2nd argument. Object schema supports the following additional method:

- `notEmpty()` - Requires the object to not be empty. Does not validate `null`.
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

## Schema

The `schema()` schema verifies a value is a schema instance. This is useful for composing
blueprints.

```ts
optimal(
	{
		value: string(),
	},
	{
		value: schema(),
	},
);
```

## Regex

The `date()` schema verifies a value is an instance of `RegExp`.

```ts
optimal(
	{},
	{
		pattern: regex(),
	},
);
```

## Shape

The `shape(shape: { [key: string]: Schema })` schema verifies a value matches a specific object
shape, defined by a collection of properties to schemas. Defaults to the structure of the shape and
_cannot_ be customized. Shape schema supports the following additional method:

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

The `string(default?: string)` schema verifies a value is a string. Defaults to an empty string
(`''`) but can be customized with the 1st argument. String schema supports the following additional
methods:

- `camelCase()` - Validate the value is in camel case (`fooBarBaz`). Must start with a lowercase
  character and contain at minimum 2 characters.
- `contains(token: string, index?: number)` - Validate the value contains the defined token.
  Supports an optional start index.
- `kebabCase()` - Validate the value is in kebab case (`foo-bar-baz`). Must separate words with a
  dash and contain at minimum 2 characters.
- `lowerCase()` - Validate the value is lower cased.
- `match(pattern: RegExp)` - Validate the value against a regex pattern.
- `notEmpty()` - Requires the value to not be empty. Does not validate `null`.
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
`tuple(schemas: Schema[])` schema will validate each item and return an array of the same length and
types. Defaults to the structure of the tuple and _cannot_ be customized.

```ts
type Record = [number, string]; // ID, name

optimal(
	{},
	{
		record: tuple<Record>([number().gt(0).required(), string().notEmpty()]),
	},
);
```

> When using TypeScript, a generic type is required for schemas to type correctly. Furthermore, the
> schema only supports a max length of 5 items.

## Union

The `union(schemas: Schema[], default: any)` schema verifies a value against a list of possible
values. The 1st argument is a list of schemas to compare against. The 2nd argument is the default
value, which must be explicitly defined.

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

Unions support multiple schemas of the same type in unison, and the first one that passes validation
will be used.

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
