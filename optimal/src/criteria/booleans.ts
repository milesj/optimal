/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */

import { invalid } from '../helpers';
import { Criteria, Options, SchemaState } from '../types';

/**
 * Require this field to only be `false`.
 */
export function onlyFalse(state: SchemaState<boolean>, options: Options = {}): Criteria<boolean> {
	state.defaultValue = false;

	return {
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
		validate(value, path) {
			invalid(value === false, options.message ?? 'May only be `false`.', path, value);
		},
	};
}

/**
 * Require this field to only be `true`.
 */
export function onlyTrue(state: SchemaState<boolean>, options: Options = {}): Criteria<boolean> {
	state.defaultValue = true;

	return {
		dontSkipIfNull: true,
		dontSkipIfUndefined: true,
		validate(value, path) {
			invalid(value === true, options.message ?? 'May only be `true`.', path, value);
		},
	};
}
