import { createSchema } from '../createSchema';
import { commonCriteria, dateCriteria } from '../criteria';
import { createDate, invalid, isValidDate } from '../helpers';
import { CommonCriterias, DateCriterias, DefaultValue, NotNull, Schema } from '../types';

export interface DateSchema<T = Date>
	extends Schema<T>,
		DateCriterias<DateSchema<T>>,
		CommonCriterias<DateSchema<T>> {
	never: () => DateSchema<never>;
	notNullable: () => DateSchema<NotNull<T>>;
	nullable: () => DateSchema<T | null>;
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
				skipIfNull: true,
				validate(value, path) {
					const time = createDate(value);

					invalid(
						isValidDate(time),
						'Must be a string, number, or `Date` that resolves to a valid date.',
						path,
						value,
					);

					return time;
				},
			},
		],
	);
}
