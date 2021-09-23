import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import {
	CommonCriterias,
	CriteriaValidator,
	DefaultValue,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface CustomSchema<T> extends Schema<T>, CommonCriterias<CustomSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => CustomSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => CustomSchema<NotNull<T>>;
	notUndefinable: () => CustomSchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => CustomSchema<T | null>;
	undefinable: () => CustomSchema<T | undefined>;
}

/**
 * Create a schema that validates a value based on a defined custom validator callback.
 */
export function custom<T>(validator: CriteriaValidator<T>, defaultValue: DefaultValue<T>) {
	return createSchema<CustomSchema<T>>({
		api: { ...commonCriteria },
		defaultValue,
		type: 'custom',
	}).custom(validator);
}
