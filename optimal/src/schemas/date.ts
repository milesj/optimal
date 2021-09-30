import { createSchema } from '../createSchema';
import { commonCriteria, dateCriteria } from '../criteria';
import { createDate, invalid, isValidDate, validateType } from '../helpers';
import {
	CommonCriterias,
	DateCriterias,
	DefaultValue,
	NotNull,
	NotUndefined,
	Schema,
} from '../types';

export interface DateSchema<T = Date>
	extends Schema<T>,
		DateCriterias<DateSchema<T>>,
		CommonCriterias<DateSchema<T>> {
	never: () => DateSchema<never>;
	notNullable: () => DateSchema<NotNull<T>>;
	notUndefinable: () => DateSchema<NotUndefined<T>>;
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
			validateType((value, path) => {
				const time = createDate(value);

				invalid(
					isValidDate(time),
					'Must be a string, number, or `Date` that resolves to a valid date.',
					path,
					value,
				);

				return time;
			}),
		],
	);
}
