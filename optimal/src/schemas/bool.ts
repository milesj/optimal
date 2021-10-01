import { createSchema } from '../createSchema';
import { booleanCriteria, commonCriteria } from '../criteria';
import { invalid, typeOf } from '../helpers';
import { CommonCriterias, DefaultValue, NotNull, NotUndefined, Options, Schema } from '../types';

export interface BooleanSchema<T = boolean> extends Schema<T>, CommonCriterias<BooleanSchema<T>> {
	never: () => BooleanSchema<never>;
	notNullable: () => BooleanSchema<NotNull<T>>;
	notUndefinable: () => BooleanSchema<NotUndefined<T>>;
	nullable: () => BooleanSchema<T | null>;
	onlyFalse: (options?: Options) => BooleanSchema<false>;
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
