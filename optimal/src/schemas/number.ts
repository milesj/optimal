import { createSchema } from '../createSchema';
import { commonCriteria, numberCriteria } from '../criteria';
import { invalid, typeOf } from '../helpers';
import {
	CommonCriterias,
	DefaultValue,
	InferNullable,
	NotNull,
	NotUndefined,
	NumberCriterias,
	Options,
	Schema,
} from '../types';

export interface NumberSchema<T = number>
	extends Schema<T>,
		NumberCriterias<NumberSchema<T>>,
		CommonCriterias<NumberSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => NumberSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => NumberSchema<NotNull<T>>;
	notUndefinable: () => NumberSchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => NumberSchema<T | null>;
	/** Require field value to be one of the provided numbers. */
	oneOf: <I extends number = number>(
		list: I[],
		options?: Options,
	) => NumberSchema<InferNullable<T, I>>;
	undefinable: () => NumberSchema<T | undefined>;
}

function cast(value: unknown): number {
	return value === undefined ? 0 : Number(value);
}

/**
 * Create a schema that validates a value is a number.
 */
export function number<T extends number>(defaultValue: DefaultValue<number> = 0): NumberSchema<T> {
	return createSchema(
		{
			api: { ...commonCriteria, ...numberCriteria },
			cast,
			defaultValue,
			type: 'number',
		},
		[
			{
				validate(value, path) {
					invalid(
						typeof value === 'number',
						`Must be a number, received ${typeOf(value)}.`,
						path,
						value,
					);
				},
			},
		],
	);
}
