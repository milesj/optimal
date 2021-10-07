import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invariant, isSchema } from '../helpers';
import { DefaultValue, NotNull, NotUndefined, Options, Schema } from '../types';

export interface LazySchema<T = boolean> extends Schema<T> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => LazySchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => LazySchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => LazySchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => LazySchema<T | null>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => LazySchema<T | undefined>;
}

/**
 * Create a schema that defers evaluation of the schema until it's needed.
 * This is useful for recursive schemas.
 */
export function lazy<T>(
	factory: (value: unknown) => Schema<T>,
	defaultValue: DefaultValue<T | null | undefined>,
): LazySchema<T> {
	invariant(typeof factory === 'function', 'Lazy requires a schema factory function.');

	return createSchema(
		{
			api: { ...commonCriteria },
			defaultValue,
			type: 'lazy',
		},
		[
			{
				validate(value, path, validateOptions) {
					const schema = factory(value);

					invariant(isSchema(schema), 'Factory must return a schema.');

					return schema.validate(value, path, validateOptions);
				},
			},
		],
	);
}
