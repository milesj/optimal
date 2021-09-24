import { createSchema } from '../createSchema';
import { classCriteria, commonCriteria } from '../criteria';
import { invalid, isObject, prettyValue, typeOf } from '../helpers';
import {
	CommonCriterias,
	Constructor,
	InferNullable,
	InstanceOfOptions,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface InstanceSchema<T> extends Schema<T>, CommonCriterias<InstanceSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => InstanceSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => InstanceSchema<NotNull<T>>;
	notUndefinable: () => InstanceSchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => InstanceSchema<T | null>;
	/**
	 * Require this field to be an instance of the defined class.
	 * When `loose` is true, will compare using the class name.
	 * This should only be used when dealing with realms and package hazards.
	 */
	of: <C>(ref: Constructor<C>, options?: InstanceOfOptions) => InstanceSchema<InferNullable<T, C>>;
	undefinable: () => InstanceSchema<T | undefined>;
}

/**
 * Create a schema that validates a value is an instance of a class.
 */
export function instance() {
	return createSchema<InstanceSchema<Object | null>>(
		{
			api: { ...commonCriteria, ...classCriteria },
			defaultValue: null,
			type: 'class',
		},
		[
			(state) => ({
				validate(value, path) {
					let valueType = typeOf(value);

					if (valueType === 'class') {
						valueType = prettyValue(value)!;
					}

					invalid(
						isObject(value) && value.constructor !== Object,
						state.type === 'class'
							? `Must be a class instance, received ${valueType}.`
							: `Must be an instance of \`${state.type}\`, received ${valueType}.`,
						path,
						value,
					);
				},
			}),
		],
	).nullable();
}
