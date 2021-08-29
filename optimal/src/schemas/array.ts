import { createSchema } from '../createSchema';
import { arrayCriteria, commonCriteria } from '../criteria';
import { createArray, invariant } from '../helpers';
import {
	AnySchema,
	ArrayCriterias,
	CommonCriterias,
	DefaultValue,
	InferNullable,
	InferSchemaType,
	Schema,
} from '../types';

export interface ArraySchema<T = unknown[]>
	extends Schema<T>,
		ArrayCriterias<ArraySchema<T>>,
		CommonCriterias<ArraySchema<T>> {
	never: () => ArraySchema<never>;
	notNullable: () => ArraySchema<NonNullable<T>>;
	nullable: () => ArraySchema<T | null>;
	of: <V extends AnySchema>(schema: V) => ArraySchema<InferNullable<T, InferSchemaType<V>[]>>;
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
					invariant(Array.isArray(value), 'Must be an array.', path);
				},
			},
		],
	);
}
