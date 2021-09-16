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
	notUndefinable: () => DateSchema<NotUndefined<T>>;
	/** Allow null values. */
	nullable: () => DateSchema<T | null>;
	undefinable: () => DateSchema<T | undefined>;
}

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
