import { invalid, invariant, isValidString, prettyValue } from '../helpers';
import { Criteria, Options, SchemaState, StringContainsOptions } from '../types';

/**
 * Require field value to contain a provided string.
 */
export function contains(
	state: SchemaState<string>,
	token: string,
	options: StringContainsOptions = {},
): Criteria<string> {
	invariant(isValidString(token), 'Contains requires a non-empty token.');

	return {
		validate(value, path) {
			invalid(
				value.includes(token, options.index ?? 0),
				options.message ?? `String does not include "${token}".`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to match a defined regex pattern.
 */
export function match(
	state: SchemaState<string>,
	pattern: RegExp,
	options: Options = {},
): Criteria<string> {
	invariant(pattern instanceof RegExp, 'Match requires a regular expression to match against.');

	return {
		validate(value, path) {
			invalid(
				!!value.match(pattern),
				`${options.message ?? 'String does not match.'} (pattern "${pattern.source}")`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be formatted in camel case (fooBar).
 */
export function camelCase(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return match(state, /^[a-z][a-zA-Z0-9]+$/u, {
		message: 'String must be in camel case.',
		...options,
	});
}

/**
 * Require field value to be formatted in kebab case (foo-bar).
 */
export function kebabCase(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return match(state, /^[a-z][a-z0-9-]+$/u, {
		message: 'String must be in kebab case.',
		...options,
	});
}

/**
 * Require field value to be formatted in pascal case (FooBar).
 */
export function pascalCase(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return match(state, /^[A-Z][a-zA-Z0-9]+$/u, {
		message: 'String must be in pascal case.',
		...options,
	});
}

/**
 * Require field value to be formatted in snake case (foo_bar).
 */
export function snakeCase(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return match(state, /^[a-z][a-z0-9_]+$/u, {
		message: 'String must be in snake case.',
		...options,
	});
}

/**
 * Require field value to not be an empty string.
 */
export function notEmpty(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return {
		validate(value, path) {
			invalid(isValidString(value), options.message ?? 'String cannot be empty.', path, value);
		},
	};
}

/**
 * Require field value to be one of the provided strings.
 */
export function oneOf(
	state: SchemaState<string>,
	list: string[],
	options: Options = {},
): Criteria<string> {
	invariant(
		Array.isArray(list) && list.length > 0 && list.every((item) => typeof item === 'string'),
		'One of requires an array of strings.',
	);

	return {
		validate(value, path) {
			invalid(
				list.includes(value),
				options.message ??
					`String must be one of: ${list.join(', ')}. Received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be all lower case.
 */
export function lowerCase(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return {
		validate(value, path) {
			invalid(
				value === value.toLocaleLowerCase(),
				options.message ?? `String must be lower cased, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be all upper case.
 */
export function upperCase(state: SchemaState<string>, options: Options = {}): Criteria<string> {
	return {
		validate(value, path) {
			invalid(
				value === value.toLocaleUpperCase(),
				options.message ?? `String must be upper cased, received ${prettyValue(value)}.`,
				path,
				value,
			);
		},
	};
}

/**
 * Require field value to be of a specific string length.
 */
export function lengthOf(
	state: SchemaState<string>,
	size: number,
	options: Options = {},
): Criteria<string> {
	invariant(typeof size === 'number' && size > 0, 'Length requires a non-zero positive number.');

	return {
		validate(value, path) {
			invalid(
				value.length === size,
				options.message ?? `String length must be ${size}, received ${value.length}.`,
				path,
				value,
			);
		},
	};
}
