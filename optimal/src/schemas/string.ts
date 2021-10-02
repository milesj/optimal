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
	never: (options?: Options) => StringSchema<never>;
	notNullable: (options?: Options) => StringSchema<NotNull<T>>;
	notUndefinable: () => StringSchema<NotUndefined<T>>;
	nullable: () => StringSchema<T | null>;
	oneOf: <I extends string = string>(
		list: I[],
		options?: Options,
	) => StringSchema<InferNullable<T, I>>;
	undefinable: () => StringSchema<T | undefined>;
}

function cast(value: unknown): string {
	return value === undefined ? '' : String(value);
}

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
