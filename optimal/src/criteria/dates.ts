import { createDate, invalid, invariant, isValidDate, prettyValue } from '../helpers';
import { Criteria, InclusiveOptions, MaybeDate, Options, SchemaState } from '../types';

/**
 * Require field value to be after the provided date.
 */
export function after(
	state: SchemaState<Date>,
	date: MaybeDate,
	options: Options = {},
): Criteria<Date> {
	const afterDate = createDate(date);

	invariant(isValidDate(afterDate), 'After date must be a valid date.');

	return {
		validate(value, path) {
			invalid(
				isValidDate(value) && value > afterDate,
				options.message ??
					`Date must come after ${prettyValue(afterDate)}, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be before the provided date.
 */
export function before(
	state: SchemaState<Date>,
	date: MaybeDate,
	options: Options = {},
): Criteria<Date> {
	const beforeDate = createDate(date);

	invariant(isValidDate(beforeDate), 'Before date must be a valid date.');

	return {
		validate(value, path) {
			invalid(
				isValidDate(value) && value < beforeDate,
				options.message ??
					`Date must come before ${prettyValue(beforeDate)}, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be between 2 date ranges.
 */
export function between(
	state: SchemaState<Date>,
	start: MaybeDate,
	end: MaybeDate,
	options: InclusiveOptions = {},
): Criteria<Date> {
	const startDate = createDate(start);
	const endDate = createDate(end);

	invariant(isValidDate(startDate), 'Between start date must be a valid date.');
	invariant(isValidDate(endDate), 'Between end date must be a valid date.');

	return {
		validate(value, path) {
			invalid(
				isValidDate(value) &&
					(options.inclusive
						? value >= startDate && value <= endDate
						: value > startDate && value < endDate),
				options.message ??
					`Date must be between ${prettyValue(startDate)} and ${prettyValue(endDate)}${
						options.inclusive ? ' inclusive' : ''
					}, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}
