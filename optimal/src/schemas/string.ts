import { createSchema } from '../createSchema';
import { commonCriteria, stringCriteria } from '../criteria';
import { invalid, typeOf } from '../helpers';
import {
	CommonCriterias,
	DefaultValue,
	InferNullable,
	NotNull,
	NotUndefined,
	Options,
	Schema,
	StringCriterias,
} from '../types';

export interface StringSchema<T = string>
	extends Schema<T>,
		StringCriterias<StringSchema<T>>,
		CommonCriterias<StringSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => StringSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => StringSchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => StringSchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => StringSchema<T | null>;
	/** Require field value to be one of the provided strings. */
	oneOf: <I extends string = string>(
		list: I[],
		options?: Options,
	) => StringSchema<InferNullable<T, I>>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => StringSchema<T | undefined>;
}

function cast(value: unknown): string {
	return value === undefined ? '' : String(value);
}

/**
 * Create a schema that validates a value is a string.
 */
export function string<T extends string = string>(
	defaultValue: DefaultValue<string> = '',
): StringSchema<T> {
	return createSchema(
		{
			api: { ...commonCriteria, ...stringCriteria },
			cast,
			defaultValue,
			type: 'string',
		},
		[
			{
				validate(value, path) {
					invalid(
						typeof value === 'string',
						`Must be a string, received ${typeOf(value)}.`,
						path,
						value,
					);
				},
			},
		],
	);
}

/**
 * Create a schema that validates a value is a UUID (universally unique identifier).
 */
// eslint-disable-next-line no-magic-numbers
export function uuid(version?: 1 | 2 | 3 | 4 | 5): StringSchema<string> {
	return string()
		.notEmpty()
		.match(
			new RegExp(
				`^([0-9a-f]{8}-[0-9a-f]{4}-[${
					version ?? '1-5'
				}][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})|([0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{12})$`,
				'i',
			),
		)
		.notNullable()
		.notUndefinable();
}
