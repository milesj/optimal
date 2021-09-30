import { AnySchema, InferSchemaType, Predicate } from './types';

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
