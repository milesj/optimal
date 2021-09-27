---
title: Predicates
---

A predicate is a functional wrapper around a [schema](./schemas.md) that returns a boolean instead
of throwing an error. This is a simple mechanism for providing a better developer experience when
handling control flow.

To create a predicate, import the `createPredicate()` function, wrap an existing schema, and assign
to a variable.

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
