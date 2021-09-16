import { invalid, invariant, isValidNumber, prettyValue } from '../helpers';
import { Criteria, InclusiveOptions, Options, SchemaState } from '../types';

/**
 * Require field value to be between 2 numbers.
 */
export function between(
	state: SchemaState<number>,
	min: number,
	max: number,
	options: InclusiveOptions = {},
): Criteria<number> {
	invariant(
		isValidNumber(min) && isValidNumber(max),
		'Between requires a minimum and maximum number.',
	);

	return {
		validate(value, path) {
			invalid(
				isValidNumber(value) &&
					(options.inclusive ? value >= min && value <= max : value > min && value < max),
				options.message ??
					`Number must be between ${min} and ${max}${
						options.inclusive ? ' inclusive' : ''
					}, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be a float (requires a decimal).
 */
export function float(state: SchemaState<number>, options: Options = {}): Criteria<number> {
	return {
		validate(value, path) {
			invalid(
				isValidNumber(value) && value % 1 !== 0,
				options.message ?? `Number must be a float, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be greater than a number.
 */
export function gt(
	state: SchemaState<number>,
	min: number,
	options: InclusiveOptions = {},
): Criteria<number> {
	invariant(isValidNumber(min), 'Greater-than requires a minimum number.');

	return {
		validate(value, path) {
			if (options.inclusive) {
				invalid(
					isValidNumber(value) && value >= min,
					options.message ??
						`Number must be greater than or equal to ${min}, received ${prettyValue(value)}.`,
					path,
					value,
				);
			} else {
				invalid(
					isValidNumber(value) && value > min,
					options.message ?? `Number must be greater than ${min}, received ${prettyValue(value)}.`,
					path,
					value,
				);
			}
		},
	};
}

/**
 * Require field value to be greater than or equals to a number.
 */
export function gte(
	state: SchemaState<number>,
	min: number,
	options: Options = {},
): Criteria<number> {
	return gt(state, min, { ...options, inclusive: true });
}

/**
 * Require field value to be an integer.
 */
export function int(state: SchemaState<number>, options: Options = {}): Criteria<number> {
	return {
		validate(value, path) {
			invalid(
				Number.isSafeInteger(value),
				options.message ?? `Number must be an integer, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be less than a number.
 */
export function lt(
	state: SchemaState<number>,
	max: number,
	options: InclusiveOptions = {},
): Criteria<number> {
	invariant(isValidNumber(max), 'Less-than requires a maximum number.');

	return {
		validate(value, path) {
			if (options.inclusive) {
				invalid(
					isValidNumber(value) && value <= max,
					options.message ??
						`Number must be less than or equal to ${max}, received ${prettyValue(value)}.`,
					path,
					value,
				);
			} else {
				invalid(
					isValidNumber(value) && value < max,
					options.message ?? `Number must be less than ${max}, received ${prettyValue(value)}.`,
					path,
					value,
				);
			}
		},
	};
}

/**
 * Require field value to be less than or equals to a number.
 */
export function lte(
	state: SchemaState<number>,
	max: number,
	options: Options = {},
): Criteria<number> {
	return lt(state, max, { ...options, inclusive: true });
}

/**
 * Require field value to be negative and _not_ zero.
 */
export function negative(state: SchemaState<number>, options: Options = {}): Criteria<number> {
	return {
		validate(value, path) {
			invalid(
				isValidNumber(value) && value < 0,
				options.message ?? `Number must be negative, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be one of the provided numbers.
 */
export function oneOf(
	state: SchemaState<number>,
	list: number[],
	options: Options = {},
): Criteria<number> {
	invariant(
		Array.isArray(list) && list.length > 0 && list.every((item) => isValidNumber(item)),
		'One of requires an array of numbers.',
	);

	return {
		validate(value, path) {
			invalid(
				list.includes(value),
				options.message ??
					`Number must be one of: ${list.join(', ')}. Received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be positive and _not_ zero.
 */
export function positive(state: SchemaState<number>, options: Options = {}): Criteria<number> {
	return {
		validate(value, path) {
			invalid(
				isValidNumber(value) && value > 0,
				options.message ?? `Number must be positive, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}
