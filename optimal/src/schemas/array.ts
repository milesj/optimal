import { createSchema } from '../createSchema';
import { arrayCriteria, commonCriteria } from '../criteria';
import { createArray, invalid } from '../helpers';
import { ArrayCriterias, CommonCriterias, DefaultValue, InferNullable, Schema } from '../types';

export interface ArraySchema<T = unknown[]>
	extends Schema<T>,
		ArrayCriterias<ArraySchema<T>>,
		CommonCriterias<ArraySchema<T>> {
	never: () => ArraySchema<never>;
	notNullable: () => ArraySchema<NonNullable<T>>;
	nullable: () => ArraySchema<T | null>;
	of: <V>(schema: Schema<V>) => ArraySchema<InferNullable<T, V[]>>;
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
