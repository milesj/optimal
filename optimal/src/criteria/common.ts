import {
	extractDefaultValue,
	invalid,
	invariant,
	isSchema,
	isValidString,
	pathKey,
	typeOf,
} from '../helpers';
import { OptimalError } from '../OptimalError';
import {
	Criteria,
	CriteriaValidator,
	Options,
	Schema,
	SchemaState,
	Transformer,
	ValueComparator,
} from '../types';
import { ValidationError } from '../ValidationError';

/**
 * Map a list of field names that must be defined alongside this field when in a shape/object.
 */
export function and<T>(state: SchemaState<T>, keys: string[], options: Options = {}): Criteria<T> {
	invariant(keys.length > 0, 'AND requires a list of field names.');

	return {
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
		validate(value, path, { currentObject }) {
			const andKeys = [...new Set([pathKey(path), ...keys])].sort();
			const undefs = andKeys.filter((key) => currentObject?.[key] == null);

			// Only error once when one of the struct is defined
			if (undefs.length === andKeys.length) {
				return;
			}

			invalid(
				undefs.length === 0,
				options.message ?? `All of these fields must be defined: ${andKeys.join(', ')}`,
			);
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
				if (error instanceof ValidationError || error instanceof OptimalError) {
					throw error;
				} else if (error instanceof Error) {
					invalid(false, error.message, path, value);
				}
			}
		},
	};
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
export function never<T>(state: SchemaState<T>, options: Options = {}) {
	state.metadata.neverMessage = options.message;
	state.defaultValue = undefined;
	state.never = true;
}

/**
 * Require this field to be explicitly defined when in a shape/object.
 */
export function required<T>(state: SchemaState<T>, options: Options = {}) {
	state.metadata.requiredMessage = options.message;
	state.required = true;
}

/**
 * Dont require this field to be explicitly defined when in a shape/object.
 */
export function optional<T>(state: SchemaState<T>) {
	state.required = false;
}

/**
 * Disallow null values.
 */
export function notNullable<T>(state: SchemaState<T>, options: Options = {}) {
	state.metadata.nullableMessage = options.message;
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
export function only<T>(state: SchemaState<T>, options: Options = {}): Criteria<T> {
	const { defaultValue } = state;

	invariant(
		defaultValue !== null && defaultValue !== undefined,
		'Only requires a non-empty default value.',
	);

	return {
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
		validate(value, path, validateOptions) {
			const testValue = extractDefaultValue(defaultValue, path, validateOptions);

			invalid(
				value === testValue,
				options.message ?? `Value may only be "${testValue}".`,
				path,
				value,
			);
		},
	};
}

/**
 * Map a list of field names that must have at least 1 defined when in a shape/object.
 */
export function or<T>(state: SchemaState<T>, keys: string[], options: Options = {}): Criteria<T> {
	invariant(keys.length > 0, 'OR requires a list of field names.');

	return {
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
		validate(value, path, { currentObject }) {
			const orKeys = [...new Set([pathKey(path), ...keys])].sort();
			const defs = orKeys.filter(
				(key) => currentObject?.[key] !== undefined && currentObject?.[key] !== null,
			);

			invalid(
				defs.length > 0,
				options.message ?? `At least one of these fields must be defined: ${orKeys.join(', ')}`,
			);
		},
	};
}

/**
 * Allow undefined values.
 */
export function undefinable<T>(state: SchemaState<T>) {
	state.undefinable = true;
}

/**
 * Disallow undefined values.
 */
export function notUndefinable<T>(state: SchemaState<T>) {
	state.undefinable = false;
}

/**
 * Transform a value before it's passed to the next criteria.
 */
export function transform<T>(state: SchemaState<T>, transformer: Transformer<T>): Criteria<T> {
	invariant(typeof transformer === 'function', 'A function is required for transforming values.');

	return {
		validate(value, path) {
			const beforeType = typeOf(value);
			const nextValue = transformer(value);
			const afterType = typeOf(nextValue);

			invalid(
				afterType === beforeType,
				`Invalid transformed value, expected ${beforeType} but received ${afterType}.`,
				path,
				value,
			);

			return nextValue;
		},
	};
}

/**
 * Validate with another schema when a condition is met.
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
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
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
				return pass.validate(value, path, validateOptions);
			}

			if (fail) {
				return fail.validate(value, path, validateOptions);
			}

			return undefined;
		},
	};
}

/**
 * Map a list of field names that must not be defined alongside this field when in a shape/object.
 */
export function xor<T>(state: SchemaState<T>, keys: string[], options: Options = {}): Criteria<T> {
	invariant(keys.length > 0, 'XOR requires a list of field names.');

	return {
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
		validate(value, path, { currentObject }) {
			const xorKeys = [...new Set([pathKey(path), ...keys])].sort();
			const defs = xorKeys.filter(
				(key) => currentObject?.[key] !== undefined && currentObject?.[key] !== null,
			);

			invalid(
				defs.length === 1,
				options.message ?? `Only one of these fields may be defined: ${xorKeys.join(', ')}`,
			);
		},
	};
}
