import { createSchema } from '../createSchema';
import { booleanCriteria, commonCriteria } from '../criteria';
import { invalid, typeOf } from '../helpers';
import { CommonCriterias, DefaultValue, NotNull, NotUndefined, Options, Schema } from '../types';

export interface BooleanSchema<T = boolean> extends Schema<T>, CommonCriterias<BooleanSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => BooleanSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => BooleanSchema<NotNull<T>>;
	notUndefinable: () => BooleanSchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => BooleanSchema<T | null>;
	/** Require this field to only be `false`. */
	onlyFalse: (options?: Options) => BooleanSchema<false>;
	/** Require this field to only be `true`. */
	onlyTrue: (options?: Options) => BooleanSchema<true>;
	undefinable: () => BooleanSchema<T | undefined>;
}

export function bool(defaultValue: DefaultValue<boolean> = false): BooleanSchema {
	return createSchema(
		{
			api: { ...commonCriteria, ...booleanCriteria },
			cast: Boolean,
			defaultValue,
			type: 'boolean',
		},
		[
			{
				validate(value, path) {
					invalid(
						typeof value === 'boolean',
						`Must be a boolean, received ${typeOf(value)}.`,
						path,
						value,
					);
				},
			},
		],
	);
}
