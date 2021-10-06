---
title: Predicates
---

A predicate is a functional wrapper around a [schema](./schemas.md) that returns a boolean instead
of throwing an error. This is a simple mechanism for providing a better developer experience when
handling control flow.

To create a predicate, import the [`createPredicate()`](/api/optimal/function/createPredicate)
function, wrap an existing schema, and assign to a variable.

```ts
import { createPredicate, string } from 'optimal';

const urlSchema = string()
	.notEmpty()
	.match(/^https?:\/\//);

const isUrl = createPredicate(urlSchema);
```

This newly assigned variable is a function that can be executed to validate a provided value. If
there are no validation errors, `true` is returned, otherwise `false` is returned.

```ts
if (isUrl(value)) {
	// Do something with the URL
}
```

## Null and undefined handling

Unlike schemas, a predicate will _always_ return false for `null` and `undefined` values, regardless
of the schema's nullable and undefinable states. We do this because a predicate ensures a truthy
value, which is the most common use case and expectation.

Let's take the previous example, and demonstrate this with nullability.

```ts
const urlSchema = string()
	.notEmpty()
	.match(/^https?:\/\//)
	.nullable();

const isUrl = createPredicate(urlSchema);

// Will always returns false, since null can never be a URL
if (isUrl(null)) {
}
```

If for some reason you _need_ to accept `null` and `undefined` values, handle them explicitly
outside of the predicate.

```ts
if (value === null || isUrl(value)) {
	// Handle both cases
}
```
