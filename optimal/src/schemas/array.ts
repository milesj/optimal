import { createSchema } from '../createSchema';
import { arrayCriteria, commonCriteria } from '../criteria';
import { createArray, invalid, typeOf } from '../helpers';
import {
	ArrayCriterias,
	CommonCriterias,
	DefaultValue,
	InferNullable,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface ArraySchema<T = unknown[]>
	extends Schema<T>,
		ArrayCriterias<ArraySchema<T>>,
		CommonCriterias<ArraySchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => ArraySchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => ArraySchema<NotNull<T>>;
	/** Disallow undefined values. */
	notUndefinable: () => ArraySchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => ArraySchema<T | null>;
	/**
	 * Require field array items to be of a specific schema type.
	 * Will rebuild the array and type cast values.
	 */
	of: <V>(schema: Schema<V>) => ArraySchema<InferNullable<T, V[]>>;
	/** Allow undefined values. */
	undefinable: () => ArraySchema<T | undefined>;
}

export function array<T = unknown>(defaultValue: DefaultValue<T[]> = []): ArraySchema<T[]> {
	return createSchema(
		{
			api: { ...commonCriteria, ...arrayCriteria },
			cast: createArray,
			defaultValue,
			type: 'array',
		},
		[
			{
				validate(value, path) {
					invalid(
						Array.isArray(value),
						`Must be an array, received ${typeOf(value)}.`,
						path,
						value,
					);
				},
			},
		],
	);
}
