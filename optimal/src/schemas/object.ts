import { createSchema } from '../createSchema';
import { commonCriteria, objectCriteria } from '../criteria';
import { createObject, invalid, isObject, typeOf } from '../helpers';
import {
	CommonCriterias,
	DefaultValue,
	InferNullable,
	NotNull,
	NotUndefined,
	ObjectCriterias,
	Options,
	Schema,
} from '../types';
import { StringSchema } from './string';

export interface ObjectSchema<T = object>
	extends Schema<T>,
		ObjectCriterias<ObjectSchema<T>>,
		CommonCriterias<ObjectSchema<T>> {
	keysOf: (schema: StringSchema, options?: Options) => ObjectSchema<T>;
	/** Mark that this field should never be used. */
	never: (options?: Options) => ObjectSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => ObjectSchema<NotNull<T>>;
	notUndefinable: () => ObjectSchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => ObjectSchema<T | null>;
	/**
	 * Require field object values to be of a specific schema type.
	 * Will rebuild the object and type cast values.
	 */
	of: <V, K extends PropertyKey = keyof T>(
		schema: Schema<V>,
	) => ObjectSchema<InferNullable<T, Record<K, V>>>;
	undefinable: () => ObjectSchema<T | undefined>;
}

export function object<V = unknown, K extends PropertyKey = string>(
	defaultValue?: DefaultValue<Record<K, V>>,
): ObjectSchema<Record<K, V>> {
	return createSchema(
		{
			api: { ...commonCriteria, ...objectCriteria },
			cast: createObject,
			defaultValue: defaultValue ?? {},
			type: 'object',
		},
		[
			{
				validate(value, path) {
					invalid(
						isObject(value),
						`Must be a plain object, received ${typeOf(value)}.`,
						path,
						value,
					);
				},
			},
		],
	);
}
