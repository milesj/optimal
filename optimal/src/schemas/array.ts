import { createSchema } from '../createSchema';
import { arrayCriteria, commonCriteria } from '../criteria';
import { createArray, invalid } from '../helpers';
import {
	ArrayCriterias,
	CommonCriterias,
	DefaultValue,
	InferNullable,
	NotNull,
	NotUndefined,
	Schema,
} from '../types';

export interface ArraySchema<T = unknown[]>
	extends Schema<T>,
		ArrayCriterias<ArraySchema<T>>,
		CommonCriterias<ArraySchema<T>> {
	never: () => ArraySchema<never>;
	notNullable: () => ArraySchema<NotNull<T>>;
	nullable: () => ArraySchema<T | null>;
	of: <V>(schema: Schema<V>) => ArraySchema<InferNullable<T, V[]>>;
	optional: () => ArraySchema<T | undefined>;
	required: () => ArraySchema<NotUndefined<T>>;
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
				skipIfNull: true,
				validate(value, path) {
					invalid(Array.isArray(value), 'Must be an array.', path, value);
				},
			},
		],
	);
}
