import { createSchema } from '../createSchema';
import { commonCriteria, dateCriteria } from '../criteria';
import { createDate, invalid, isValidDate, typeOf } from '../helpers';
import {
	CommonCriterias,
	DateCriterias,
	DefaultValue,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface DateSchema<T = Date>
	extends Schema<T>,
		DateCriterias<DateSchema<T>>,
		CommonCriterias<DateSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => DateSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => DateSchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => DateSchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => DateSchema<T | null>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => DateSchema<T | undefined>;
}

/**
 * Create a schema that validates a value is a date.
 * Supports `Date` objects, an ISO-8601 string, or a UNIX timestamp
 */
export function date(defaultValue?: DefaultValue<Date>): DateSchema<Date> {
	return createSchema(
		{
			api: { ...commonCriteria, ...dateCriteria },
			cast: createDate,
			defaultValue: defaultValue ?? new Date(),
			type: 'date',
		},
		[
			{
				validate(value, path) {
					const time = createDate(value);

					invalid(
						isValidDate(time),
						`Must be a string, number, or \`Date\` that resolves to a valid date, received ${typeOf(
							value,
						)}.`,
						path,
						value,
					);

					return time;
				},
			},
		],
	);
}
