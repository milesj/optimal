# Usage

Most functionality is handled through a single function, `optimal()`, which requires a
[struct](#struct), [blueprint](#blueprint), and optional configuration [options](#options). To
understand its power, lets define a class that accepts an options object in the constructor.

```ts
import optimal, { bool, string } from 'optimal';

interface PluginOptions {
	debug?: boolean;
	priority?: 'low' | 'normal' | 'high';
}

class Plugin {
	options: Required<PluginOptions>;

	constructor(options: PluginOptions = {}) {
		this.options = optimal(options, {
			debug: bool(),
			priority: string('low').oneOf(['low', 'normal', 'high']),
		});
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

The blueprint is an object of [predicates](./predicates.md) that define an exact structure to be
returned from `optimal()`. Each predicate defines a default value to be used when a struct field of
the same name is undefined or missing . Furthermore, it provides a fluent interface for adding rules
to be ran during the validation process.

> Predicate factory functions are named imports from the `optimal` module.

## Options

The following options can be passed to the 3rd argument.

- `file` (string) - Include a filename in validation error messages. Can be used in conjunction with
  `name`.
- `name` (string) - Include a class name in validation error messages. Can be used in conjunction
  with `file`.
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
