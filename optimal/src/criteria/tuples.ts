import { invalid, invariant, isSchema } from '../helpers';
import { AnySchema, Criteria, Schema, SchemaState } from '../types';

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

			return itemsSchemas.map(
				(item, i) => item.validate(value[i], `${path}[${i}]`, validateOptions) as unknown,
			);
		},
	};
}
