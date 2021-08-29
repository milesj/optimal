import { createSchema } from '../createSchema';
import { commonCriteria, objectCriteria } from '../criteria';
import { createObject, invariant, isObject } from '../helpers';
import {
	AnySchema,
	CommonCriterias,
	DefaultValue,
	InferNullable,
	InferSchemaType,
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
	notNullable: () => ObjectSchema<NonNullable<T>>;
	nullable: () => ObjectSchema<T | null>;
	of: <V extends AnySchema, K extends PropertyKey = keyof T>(
		schema: V,
	) => ObjectSchema<InferNullable<T, Record<K, InferSchemaType<V>>>>;
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
					invariant(isObject(value), 'Must be a plain object.', path);
				},
			},
		],
	);
}
