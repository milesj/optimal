---
title: Schemas
---

A schema is a factory function that returns a fluent and typed builder interface. This builder can
be used to chain validation rules, define a default value, parse values, and more!

All schemas support methods found on the [`CommonCriterias`](/api/optimal/interface/CommonCriterias)
interface.

## Arrays

The [`array()`](/api/optimal/function/array) schema verifies a value is an array, or an array _of_ a
specific type. For undefined values, an empty array (`[]`) is returned, which can be customized with
the 1st argument.

```ts
import { array, string } from 'optimal';

const anyArraySchema = array();

anyArraySchema.validate([]); // pass
anyArraySchema.validate([1, 2, 3]); // pass
anyArraySchema.validate(['a', 'b', 'c']); // pass

const stringArraySchema = array(['foo']).of(string()).notEmpty();

stringArraySchema.validate([]); // fail
stringArraySchema.validate([1, 2, 3]); // fail
stringArraySchema.validate(['a', 'b', 'c']); // pass
```

Array schemas support all methods found on the [`ArraySchema`](/api/optimal/interface/ArraySchema)
interface.

## Blueprints

The [`blueprint()`](/api/optimal/function/blueprint) schema verifies a value is an object that maps
properties to schema instances. This schema is useful for composition based APIs.

```ts
import { blueprint } from 'optimal';

blueprint().validate({
	name: string(),
	type: number(),
});
```

## Booleans

The [`bool()`](/api/optimal/function/bool) schema verifies a value is a boolean. For undefined
values, `false` is returned, which can be customized with the 1st argument.

```ts
import { bool } from 'optimal';

const anyBoolSchema = bool();

anyBoolSchema.validate(true); // pass
anyBoolSchema.validate(false); // pass
anyBoolSchema.validate(123); // fail

const falsyBoolSchema = bool().onlyFalse();

falsyBoolSchema.validate(true); // fail
falsyBoolSchema.validate(false); // pass
```

Boolean schemas support all methods found on the
[`BooleanSchema`](/api/optimal/interface/BooleanSchema) interface.

## Class instances

The [`instance()`](/api/optimal/function/instance) schema verifies a value is an instance of a
specific class (when using `of()`), or simply an instance of any class (by default). This schema is
nullable by default and may return `null`.

```ts
import { instance } from 'optimal';

class Foo {}
class Bar {}

const anyClassSchema = instance();

anyClassSchema.validate(new Foo()); // pass
anyClassSchema.validate(new Bar()); // pass

const fooSchema = instance().of(Foo);

fooSchema.validate(new Foo()); // pass
fooSchema.validate(new Bar()); // fail
```

Since `instanceof` checks are problematic across realms or when dealing with dual-package hazards,
an optional `loose` argument can be enabled as the 2nd argument on `of()`. This will compare
constructor names, which is brittle, but unblocks certain scenarios.

```ts
const looseFooSchema = instance().of(Foo, true);
```

Instance schemas support all methods found on the
[`InstanceSchema`](/api/optimal/interface/InstanceSchema) interface.

## Custom

The [`custom()`](/api/optimal/function/custom) schema verifies a value based on a user-provided
callback. This callback receives the current value to validate, an object path, and validation
options (which includes any root and current objects).

A default value is required as the 2nd argument.

```ts
import path from 'path';
import { custom } from 'optimal';

const absPathSchema = custom((value) => {
	if (!path.isAbsolute(value)) {
		throw new Error('Path must be absolute.');
	}
}, process.cwd());

absPathSchema.validate('/absolute/path'); // pass
absPathSchema.validate('../relative/path'); // fail
```

Custom schemas support all methods found on the
[`CustomSchema`](/api/optimal/interface/CustomSchema) interface.

## Dates

The [`date()`](/api/optimal/function/date) schema verifies a value is date-like, which supports
`Date` objects, an ISO-8601 string, or a UNIX timestamp. Regardless of the input value, a `Date`
object is always returned as the output value. For undefined values, a new `Date` is returned.

```ts
import { date } from 'optimal';

const dateSchema = date();

dateSchema.validate(new Date()); // pass
dateSchema.validate(1632450940763); // pass
dateSchema.validate('2021-09-24T02:32:31.610Z'); // pass
```

Date schemas support all methods found on the [`DateSchema`](/api/optimal/interface/DateSchema)
interface.

## Functions

The [`func()`](/api/optimal/function/func) schema verifies a value is a function.

```ts
import { func } from 'optimal';

const funcSchema = func();

funcSchema.validate(() => {}); // pass
funcSchema.validate(123); // fail
```

By default this schema has no default value (returns `undefined`), regardless of undefinable state,
but this can be customized with the 1st argument. However, because of our
[lazy default values](./usage.md#default-values), the "default function" must be returned with
another function.

```ts
import { func } from 'optimal';

function noop() {}

// Incorrect
func(noop);

// Correct
func(() => noop);
```

Function schemas support all methods found on the
[`FunctionSchema`](/api/optimal/interface/FunctionSchema) interface.

## IDs

The [`id()`](/api/optimal/function/id) schema verifies a value is an auto-incrementing ID, most
commonly used for database records. All IDs _must_ be a positive integer, and will not accept `0`,
`null`, or `undefined`.

```ts
import { id } from 'optimal';

const idSchema = id();

idSchema.validate(123); // pass
idSchema.validate(0); // fail
idSchema.validate(-123); // fail
idSchema.validate(null); // fail
```

ID schemas support all methods found on the [`NumberSchema`](/api/optimal/interface/NumberSchema)
interface.

## Lazy / recursive

The [`lazy()`](/api/optimal/function/number) schema is useful for declaring deferred evaluation or
recursive schemas. When using this pattern, the lazy element _must_ declare a default value, and
_must_ never be required.

```ts
import { lazy, LazySchema, number, shape } from 'optimal';

interface Node {
	id: number;
	child?: Node | null;
}

const node: LazySchema<Node> = shape({
	id: number(),
	child: lazy(() => node, null).nullable(),
});
```

> Because of a limitation in TypeScript, the return type cannot be statically inferred, so you'll
> need to type the schema variable directly with `LazySchema`.

## Numbers

The [`number()`](/api/optimal/function/number) schema verifies a value is a number. For undefined
values, a `0` is returned, which can be customized with the 1st argument.

```ts
import { number } from 'optimal';

const anyNumberSchema = number();

anyNumberSchema.validate(123); // pass
anyNumberSchema.validate('abc'); // fail

const intGteNumberSchema = number(100).int().gte(100);

intGteNumberSchema.validate(150); // pass
intGteNumberSchema.validate(50); // fail
intGteNumberSchema.validate(200.25); // fail
```

Number schemas support all methods found on the
[`NumberSchema`](/api/optimal/interface/NumberSchema) interface.

## Objects

The [`object()`](/api/optimal/function/object) schema verifies a value is a plain object or an
indexed object with all values of a specific type. For undefined values, an empty object (`{}`) is
returned, which can be customized with the 1st argument.

```ts
import { object, number } from 'optimal';

const anyObjectSchema = object();

anyObjectSchema.validate({}); // pass
anyObjectSchema.validate({ foo: 123 }); // pass
anyObjectSchema.validate({ bar: 'abc' }); // pass

const numberObjectSchema = object().of(number());

numberObjectSchema.validate({ foo: 123 }); // pass
numberObjectSchema.validate({ bar: 'abc' }); // fail
```

Objects can also define schemas for keys. For example, say we _only_ want underscored names.

```ts
object().keysOf(string().snakeCase());
```

Object schemas support all methods found on the
[`ObjectSchema`](/api/optimal/interface/ObjectSchema) interface.

## Records

The [`record()`](/api/optimal/function/record) schema is an alias for [objects](#objects).

```ts
import { record } from 'optimal';
```

## Regex patterns

The [`regex()`](/api/optimal/function/regex) schema verifies a value is an instance of `RegExp`.
This schema is nullable by default and may return `null`.

```ts
import { regex } from 'optimal';

const regexSchema = regex();

regexSchema.validate(/foo/); // pass
regexSchema.validate(new RegExp('bar')); // pass
regexSchema.validate('baz'); // fail
```

Regex schemas support all methods found on the
[`InstanceSchema`](/api/optimal/interface/InstanceSchema) interface.

## Schemas

The [`schema()`](/api/optimal/function/schema) schema verifies a value is a schema instance. This is
useful for composing blueprints.

```ts
import { number, schema } from 'optimal';

const anySchema = schema();

anySchema.validate(number()); // pass
anySchema.validate({}); // fail
```

## Shapes

The [`shape()`](/api/optimal/function/shape) schema verifies a value matches a explicit object
shape, defined as a blueprint mapping properties to schemas. For undefined values, defaults to the
structure of the shape and _cannot_ be customized.

```ts
import { bool, shape, string } from 'optimal';

const imageSchema = shape({
	name: string().notEmpty().required(),
	path: string().required(),
	type: string('png'),
	relative: bool(),
});

imageSchema.validate({
	name: 'Image',
	path: '/some/path/image.png',
	type: 'png',
	relative: false,
}); // pass

imageSchema.validate({ name: 'Invalid', size: 123 }); // fail
```

Shape schemas support all methods found on the [`ShapeSchema`](/api/optimal/interface/ShapeSchema)
interface.

## Strings

The [`string()`](/api/optimal/function/string) schema verifies a value is a string. For undefined
values, an empty string (`''`) is returned, which can be customized with the 1st argument.

```ts
import { string } from 'optimal';

const anyStringSchema = string();

anyStringSchema.validate(''); // pass
anyStringSchema.validate('abc'); // pass

const fileTypeSchema = string('js').oneOf(['js', 'ts', 'css', 'html']);

fileTypeSchema.validate('js'); // pass
fileTypeSchema.validate('png'); // fail
```

## Tuples

A tuple is an array-like structure with a defined set of items, each with their own unique type. The
[`tuple()`](/api/optimal/function/tuple) schema will validate each item and return an array of the
same length and types. Defaults to the structure of the tuple and _cannot_ be customized.

```ts
import { number, string tuple } from 'optimal';

type Item = [number, string]; // ID, name

const itemTuple = tuple<Item>([number().gt(0).required(), string().notEmpty()]);

itemTuple.validate([]); // fail
itemTuple.validate([123]); // pass
itemTuple.validate([123, 'abc']); // pass
itemTuple.validate([123, 'abc', true]); // fail
```

Tuple schemas support all methods found on the [`TupleSchema`](/api/optimal/interface/TupleSchema)
interface.

> When using TypeScript, a generic type is required for schemas to type correctly. Furthermore, the
> schema only supports a max length of 5 items.

## Unions

The [`union()`](api/optimal/function/union) schema verifies a value against a list of possible
values. All unions _require_ a default value as the 1st argument, as we need a value to fallback to.

```ts
import { array, string, shape, union } from 'optimal';

type EntryPoint = string | string[] | { path: string };

const entryPointSchema = union<EntryPoint>('./src/index.ts').of([
	string(),
	array(string()),
	shape({
		path: string(),
	}),
]);

entryPointSchema.validate('./some/path'); // pass
entryPointSchema.validate(['./some/path', './another/path']); // pass
entryPointSchema.validate({ path: './some/path' }); // pass
```

Unions support multiple schemas of the same type in unison, and the first one that passes validation
will be used.

```ts
import { number, string, object, union } from 'optimal';

const objectOfNumberOrString = union<Record<string, number> | Record<string, string>>({}).of([
	object(number()),
	object(string()),
]);
```

Unions also support objects and shapes in unison. However, when using this approach, be sure that
shapes are listed first so that they validate their shape early and exit the validation process.

```ts
import { number, string, object, union } from 'optimal';

const shapeOrObject = union<{ path: string } | Record<string, number>>({}).of([
	shape({
		path: string(),
	}),
	object(number()),
]);
```

Union schemas support all methods found on the [`UnionSchema`](/api/optimal/interface/UnionSchema)
interface.

> When using TypeScript, the type cannot be inferred automatically, so defaults to `unknown`. This
> can be overridden by explicitly defining the generic, as seen in the examples above.

## UUIDs

The [`uuid()`](/api/optimal/function/uuid) schema verifies a value is a universally unique
identifier, most commonly used for database records. All UUIDs _must_ be align with the
[specification](https://en.wikipedia.org/wiki/Universally_unique_identifier), and will not accept an
empty string (`""`), `null`, or `undefined`.

```ts
import { uuid } from 'optimal';

const uuidSchema = uuid();

uuidSchema.validate('e023d5bd-5c1b-3b47-8646-cacb8b8e3634'); // pass
uuidSchema.validate(''); // fail
uuidSchema.validate(null); // fail
```

By default the schema will validate _all_ UUID versions, but this can be customized with the 1st
argument.

```ts
const v4UuidSchema = uuid(4);
```

UUID schemas support all methods found on the [`StringSchema`](/api/optimal/interface/StringSchema)
interface.
