import { invalid, invariant, isSchema } from '../helpers';
import { AnySchema, Criteria, Schema, SchemaState } from '../types';
import { ValidationError } from '../ValidationError';

export type InferTupleItems<T> = T extends [infer A, infer B, infer C, infer D, infer E]
	? [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>]
	: T extends [infer A, infer B, infer C, infer D]
	? [Schema<A>, Schema<B>, Schema<C>, Schema<D>]
	: T extends [infer A, infer B, infer C]
	? [Schema<A>, Schema<B>, Schema<C>]
	: T extends [infer A, infer B]
	? [Schema<A>, Schema<B>]
	: T extends [infer A]
	? [Schema<A>]
	: AnySchema[];

/**
 * Require field array items to be of a specific schema type.
 * Will rebuild the array and type cast values.
 * @internal
 */
export function of<T extends unknown[]>(
	state: SchemaState<T>,
	itemsSchemas: InferTupleItems<T>,
): Criteria<T> {
	invariant(
		Array.isArray(itemsSchemas) && itemsSchemas.length > 0 && itemsSchemas.every(isSchema),
		'A non-empty array of schemas are required for a tuple.',
	);

	state.type = `tuple<${itemsSchemas.map((item) => item.type()).join(', ')}>`;

	return {
		validate(value, path, validateOptions) {
			invalid(
				Array.isArray(value) && value.length <= itemsSchemas.length,
				`Value must be a tuple with ${itemsSchemas.length} items, received ${value.length}.`,
				path,
				value,
			);

			const errors: Error[] = [];

			const items = itemsSchemas.map((item, i) => {
				try {
					return item.validate(value[i], `${path}[${i}]`, validateOptions) as unknown;
				} catch (error: unknown) {
					if (error instanceof Error) {
						errors.push(error);
					}
				}

				return null;
			});

			if (errors.length > 0) {
				throw new ValidationError(errors, path, value);
			}

			return items;
		},
	};
}
