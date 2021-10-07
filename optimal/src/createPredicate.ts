import { AnySchema, InferSchemaType, Predicate } from './types';

/**
 * Create a reusable predicate from a schema that validates a value to
 * return a boolean if no validation errors arise. If null or undefined
 * is returned, will return `false`, regardless of nullable or undefinable
 * state.
 */
export function createPredicate<S extends AnySchema, T = InferSchemaType<S>>(
	schema: S,
): Predicate<T> {
	return (value) => {
		try {
			if (value == null) {
				throw new Error('Avoid null/undefined');
			}

			schema.validate(value);
		} catch {
			return false;
		}

		return true;
	};
}
