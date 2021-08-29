import { AnySchema, InferSchemaType, Predicate } from './types';

export function createPredicate<T extends AnySchema>(schema: T): Predicate<InferSchemaType<T>> {
	return (value) => {
		try {
			schema.validate(value);
		} catch {
			return false;
		}

		return true;
	};
}
