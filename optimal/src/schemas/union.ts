import { createSchema } from '../createSchema';
import { commonCriteria, unionCriteria } from '../criteria';
import {
	AnySchema,
	CommonCriterias,
	DefaultValue,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface UnionSchema<T> extends Schema<T>, CommonCriterias<UnionSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => UnionSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => UnionSchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => UnionSchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => UnionSchema<T | null>;
	// Distribute these types in the future. Currently breaks on nulls...
	/** Require field value to be one of a specific schema type. */
	of: (schemas: AnySchema[], options?: Options) => UnionSchema<T>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => UnionSchema<T | undefined>;
}

/**
 * Create a schema that validates a value against a list of possible values.
 */
export function union<T = unknown>(defaultValue: DefaultValue<T>): UnionSchema<T> {
	return createSchema<UnionSchema<T>>({
		api: { ...commonCriteria, ...unionCriteria },
		defaultValue,
		type: 'union',
	});
}
