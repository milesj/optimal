import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invariant, isSchema } from '../helpers';
import { DefaultValue, NotNull, Schema } from '../types';

export interface LazySchema<T = boolean> extends Schema<T> {
	never: () => LazySchema<never>;
	notNullable: () => LazySchema<NotNull<T>>;
	nullable: () => LazySchema<T | null>;
}

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
				// Avoid recursion by returning early and using the provided default value
				skipIfNull: true,
				skipIfOptional: true,
				validate(value, path, validateOptions) {
					const schema = factory(value);

					invariant(isSchema(schema), 'Factory must return a schema.');

					return schema.validate(value, path, validateOptions);
				},
			},
		],
	);
}
