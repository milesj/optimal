import { createSchema } from '../createSchema';
import { arrayCriteria, commonCriteria } from '../criteria';
import { createArray, invariant } from '../helpers';
import {
	AnySchema,
	ArrayCriterias,
	CommonCriterias,
	Criteria,
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

function validateType(): Criteria<unknown[]> | void {
	return {
		skipIfNull: true,
		validate(value, path) {
			invariant(Array.isArray(value), 'Must be an array.', path);
		},
	};
}

export function array<T = unknown>(defaultValue: T[] = []): ArraySchema<T[]> {
	return createSchema({
		cast: createArray,
		criteria: { ...commonCriteria, ...arrayCriteria },
		defaultValue,
		type: 'array',
		validateType,
	});
}
