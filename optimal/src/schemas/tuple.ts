import { createSchema } from '../createSchema';
import { commonCriteria, tupleCriteria } from '../criteria';
import { InferTupleItems } from '../criteria/tuples';
import { createArray, invalid } from '../helpers';
import { CommonCriterias, NotNull, NotUndefined, Schema } from '../types';

export interface TupleSchema<T> extends Schema<Required<T>>, CommonCriterias<TupleSchema<T>> {
	never: () => TupleSchema<never>;
	notNullable: () => TupleSchema<NotNull<T>>;
	notUndefinable: () => TupleSchema<NotUndefined<T>>;
	nullable: () => TupleSchema<T | null>;
	/** @internal */
	of: <I extends unknown[]>(schemas: InferTupleItems<I>) => TupleSchema<I>;
	undefinable: () => TupleSchema<T | undefined>;
}

export function tuple<T extends unknown[] = unknown[]>(
	schemas: InferTupleItems<T>,
): TupleSchema<T> {
	return createSchema<TupleSchema<T>>(
		{
			api: { ...commonCriteria, ...tupleCriteria },
			// @ts-expect-error Ignore this, it's safe
			cast: createArray,
			type: 'tuple',
		},
		[
			{
				validate(value, path) {
					if (value === undefined) {
						// Will be built from its items
						return [];
					}

					invalid(Array.isArray(value), 'Must be a tuple.', path, value);

					return value;
				},
			},
		],
	).of(schemas);
}
