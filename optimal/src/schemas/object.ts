import { createSchema } from '../createSchema';
import { commonCriteria, objectCriteria } from '../criteria';
import { createObject, invalid, isObject } from '../helpers';
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
	never: () => ObjectSchema<never>;
	notNullable: () => ObjectSchema<NotNull<T>>;
	nullable: () => ObjectSchema<T | null>;
	of: <V, K extends PropertyKey = keyof T>(
		schema: Schema<V>,
	) => ObjectSchema<InferNullable<T, Record<K, V>>>;
	optional: () => ObjectSchema<T | undefined>;
	required: () => ObjectSchema<NotUndefined<T>>;
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
				skipIfNull: true,
				validate(value, path) {
					invalid(isObject(value), 'Must be a plain object.', path, value);
				},
			},
		],
	);
}
