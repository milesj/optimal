import { invalid, invariant, isSchema, isValidString, pathKey } from '../helpers';
import { Criteria, CriteriaValidator, Schema, SchemaState, ValueComparator } from '../types';

/**
 * Map a list of field names that must be defined alongside this field.
 */
export function and<T>(state: SchemaState<T>, ...keys: string[]): Criteria<T> {
	invariant(keys.length > 0, 'AND requires a list of field names.');

	return {
		validate(value, path, { currentObject }) {
			const andKeys = [...new Set([pathKey(path), ...keys])].sort();
			const undefs = andKeys.filter(
				(key) => currentObject?.[key] === undefined || currentObject?.[key] === null,
			);

			// Only error once when one of the struct is defined
			if (undefs.length === andKeys.length) {
				return;
			}

			invalid(undefs.length === 0, `All of these fields must be defined: ${andKeys.join(', ')}`);
		},
	};
}

/**
 * Set a callback to run custom validation logic.
 */
export function custom<T>(state: SchemaState<T>, validator: CriteriaValidator<T>): Criteria<T> {
	invariant(typeof validator === 'function', 'Custom requires a validation function.');

	return {
		validate(value, path, validateOptions) {
			try {
				validator(value, path, validateOptions);
			} catch (error: unknown) {
				if (error instanceof Error) {
					invalid(false, error.message, path, value);
				}
			}
		},
	};
}

/**
 * Require this field to be explicitly defined.
 */
export function defined<T>(state: SchemaState<T>) {
	state.defined = true;
}

/**
 * Set a message to log when this field is present.
 */
export function deprecate<T>(state: SchemaState<T>, message: string) {
	invariant(isValidString(message), 'A non-empty string is required for deprecated messages.');

	state.metadata.deprecatedMessage = message;
}

/**
 * Mark that this field should never be used.
 */
export function never<T>(state: SchemaState<T>) {
	state.defaultValue = undefined;
	state.never = true;
}

/**
 * Dont require this field to be explicitly defined.
 */
export function notDefined<T>(state: SchemaState<T>) {
	state.defined = false;
}

/**
 * Disallow null values.
 */
export function notNullable<T>(state: SchemaState<T>) {
	state.nullable = false;
}

/**
 * Allow null values.
 */
export function nullable<T>(state: SchemaState<T>) {
	state.nullable = true;
}

/**
 * Mark that this field can ONLY use a value that matches the default value.
 */
export function only<T>(state: SchemaState<T>): Criteria<T> {
	const { defaultValue } = state;

	invariant(
		defaultValue !== null && defaultValue !== undefined,
		'Only requires a non-empty default value.',
	);

	return {
		validate(value, path) {
			invalid(value === defaultValue, `Value may only be "${defaultValue}".`, path, value);
		},
	};
}

/**
 * Map a list of field names that must have at least 1 defined.
 */
export function or<T>(state: SchemaState<T>, ...keys: string[]): Criteria<T> {
	invariant(keys.length > 0, 'OR requires a list of field names.');

	return {
		validate(value, path, { currentObject }) {
			const orKeys = [...new Set([pathKey(path), ...keys])].sort();
			const defs = orKeys.filter(
				(key) => currentObject?.[key] !== undefined && currentObject?.[key] !== null,
			);

			invalid(
				defs.length > 0,
				`At least one of these fields must be defined: ${orKeys.join(', ')}`,
			);
		},
	};
}

/**
 * Allow undefined values.
 */
export function optional<T>(state: SchemaState<T>) {
	state.optional = true;
}

/**
 * Disallow undefined values.
 */
export function required<T>(state: SchemaState<T>) {
	state.optional = false;
}

/**
 * Validate with a specific schema when a condition is met.
 */
export function when<T>(
	state: SchemaState<T>,
	condition: T | ValueComparator<T>,
	pass: Schema<T>,
	fail?: Schema<T>,
): Criteria<T> {
	invariant(isSchema(pass), 'A schema is required when the condition passes.');

	if (fail !== undefined) {
		invariant(isSchema(fail), 'A schema is required when the condition fails.');
	}

	return {
		validate(value, path, validateOptions) {
			const passed =
				typeof condition === 'function'
					? (condition as ValueComparator<T>)(
							value,
							validateOptions.currentObject,
							validateOptions.rootObject,
					  )
					: condition === value;

			if (passed) {
				return pass.validate(value, path);
			}

			if (fail) {
				return fail.validate(value, path, validateOptions);
			}

			return undefined;
		},
	};
}

/**
 * Map a list of field names that must not be defined alongside this field.
 */
export function xor<T>(state: SchemaState<T>, ...keys: string[]): Criteria<T> {
	invariant(keys.length > 0, 'XOR requires a list of field names.');

	return {
		validate(value, path, { currentObject }) {
			const xorKeys = [...new Set([pathKey(path), ...keys])].sort();
			const defs = xorKeys.filter(
				(key) => currentObject?.[key] !== undefined && currentObject?.[key] !== null,
			);

			invalid(defs.length === 1, `Only one of these fields may be defined: ${xorKeys.join(', ')}`);
		},
	};
}
