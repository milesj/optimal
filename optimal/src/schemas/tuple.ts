import { createSchema } from '../createSchema';
import { commonCriteria, tupleCriteria } from '../criteria';
import { InferTupleItems } from '../criteria/tuples';
import { createArray, invalid, typeOf } from '../helpers';
import { CommonCriterias, NotNull, NotUndefined, Options, Schema } from '../types';

export interface TupleSchema<T> extends Schema<Required<T>>, CommonCriterias<TupleSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => TupleSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => TupleSchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => TupleSchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => TupleSchema<T | null>;
	/** @internal */
	of: <I extends unknown[]>(schemas: InferTupleItems<I>) => TupleSchema<I>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => TupleSchema<T | undefined>;
}

/**
 * Create a schema that validates a value is a tuple; an explicit list of types.
 */
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

					invalid(Array.isArray(value), `Must be a tuple, received ${typeOf(value)}.`, path, value);

					return value;
				},
			},
		],
	).of(schemas);
}
