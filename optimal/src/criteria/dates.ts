import { createDate, invalid, invariant, isValidDate } from '../helpers';
import { Criteria, InclusiveOptions, MaybeDate, Options, SchemaState } from '../types';

/**
 * Require field value to be after the provided date.
 */
export function after(
	state: SchemaState<Date>,
	date: MaybeDate,
	options: Options = {},
): Criteria<Date> | void {
	if (__DEV__) {
		const afterDate = createDate(date);

		invariant(isValidDate(afterDate), 'After date must be a valid date.');

		return {
			skipIfNull: true,
			validate(value, path) {
				invalid(
					isValidDate(value) && value > afterDate,
					options.message ?? `Date must come after ${afterDate.toLocaleDateString()}.`,
					path,
					value,
				);
			},
		};
	}
}

/**
 * Require field value to be before the provided date.
 */
export function before(
	state: SchemaState<Date>,
	date: MaybeDate,
	options: Options = {},
): Criteria<Date> | void {
	if (__DEV__) {
		const beforeDate = createDate(date);

		invariant(isValidDate(beforeDate), 'Before date must be a valid date.');

		return {
			skipIfNull: true,
			validate(value, path) {
				invalid(
					isValidDate(value) && value < beforeDate,
					options.message ?? `Date must come before ${beforeDate.toLocaleDateString()}.`,
					path,
					value,
				);
			},
		};
	}
}

/**
 * Require field value to be between 2 date ranges.
 */
export function between(
	state: SchemaState<Date>,
	start: MaybeDate,
	end: MaybeDate,
	options: InclusiveOptions = {},
): Criteria<Date> | void {
	if (__DEV__) {
		const startDate = createDate(start);
		const endDate = createDate(end);

		invariant(isValidDate(startDate), 'Between start date must be a valid date.');
		invariant(isValidDate(endDate), 'Between end date must be a valid date.');

		return {
			skipIfNull: true,
			validate(value, path) {
				invalid(
					isValidDate(value) &&
						(options.inclusive
							? value >= startDate && value <= endDate
							: value > startDate && value < endDate),
					options.message ??
						`Date must be between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}${
							options.inclusive ? ' inclusive' : ''
						}.`,
					path,
					value,
				);
			},
		};
	}
}
