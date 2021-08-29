import { invariant, isValidString } from '../helpers';
import { Criteria, Options, SchemaState } from '../types';

/**
 * Require field value to contain a provided string.
 */
export function contains(
	state: SchemaState<string>,
	token: string,
	options: Options & { index?: number } = {},
): Criteria<string> | void {
	if (__DEV__) {
		invariant(isValidString(token), 'Contains requires a non-empty token.');

		return {
			skipIfNull: true,
			skipIfOptional: true,
			validate(value, path) {
				invariant(
					value.includes(token, options.index ?? 0),
					options.message ?? `String does not include "${token}".`,
					path,
				);
			},
		};
	}
}

/**
 * Require field value to match a defined regex pattern.
 */
export function match(
	state: SchemaState<string>,
	pattern: RegExp,
	options: Options = {},
): Criteria<string> | void {
	if (__DEV__) {
		invariant(pattern instanceof RegExp, 'Match requires a regular expression to match against.');

		return {
			skipIfNull: true,
			skipIfOptional: true,
			validate(value, path) {
				invariant(
					!!value.match(pattern),
					`${options.message ?? 'String does not match.'} (pattern "${pattern.source}")`,
					path,
				);
			},
		};
	}
}

/**
 * Require field value to be formatted in camel case (fooBar).
 */
export function camelCase(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	return match(state, /^[a-z][a-zA-Z0-9]+$/u, {
		message: 'String must be in camel case.',
		...options,
	});
}

/**
 * Require field value to be formatted in kebab case (foo-bar).
 */
export function kebabCase(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	return match(state, /^[a-z][a-z0-9-]+$/u, {
		message: 'String must be in kebab case.',
		...options,
	});
}

/**
 * Require field value to be formatted in pascal case (FooBar).
 */
export function pascalCase(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	return match(state, /^[A-Z][a-zA-Z0-9]+$/u, {
		message: 'String must be in pascal case.',
		...options,
	});
}

/**
 * Require field value to be formatted in snake case (foo_bar).
 */
export function snakeCase(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	return match(state, /^[a-z][a-z0-9_]+$/u, {
		message: 'String must be in snake case.',
		...options,
	});
}

/**
 * Require field value to not be an empty string.
 */
export function notEmpty(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	if (__DEV__) {
		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(isValidString(value), options.message ?? 'String cannot be empty.', path);
			},
		};
	}
}

/**
 * Require field value to be one of the provided string.
 */
export function oneOf(
	state: SchemaState<string>,
	list: string[],
	options: Options = {},
): Criteria<string> | void {
	if (__DEV__) {
		invariant(
			Array.isArray(list) && list.length > 0 && list.every((item) => isValidString(item)),
			'One of requires a non-empty array of strings.',
		);

		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(
					list.includes(value),
					options.message ?? `String must be one of: ${list.join(', ')}`,
					path,
				);
			},
		};
	}
}

/**
 * Require field value to be all lower case.
 */
export function lowerCase(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	if (__DEV__) {
		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(
					value === value.toLocaleLowerCase(),
					options.message ?? 'String must be lower cased.',
					path,
				);
			},
		};
	}
}

/**
 * Require field value to be all upper case.
 */
export function upperCase(
	state: SchemaState<string>,
	options: Options = {},
): Criteria<string> | void {
	if (__DEV__) {
		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(
					value === value.toLocaleUpperCase(),
					options.message ?? 'String must be upper cased.',
					path,
				);
			},
		};
	}
}

/**
 * Require field array to be of a specific size.
 */
export function sizeOf(
	state: SchemaState<string>,
	size: number,
	options: Options = {},
): Criteria<string> | void {
	if (__DEV__) {
		invariant(typeof size === 'number' && size > 0, 'Size requires a non-zero positive number.');

		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(value.length === size, options.message ?? `String length must be ${size}.`, path);
			},
		};
	}
}