import { invariant, isSchema } from '../helpers';
import { Criteria, Options, Schema, SchemaState } from '../types';

/**
 * Require field array to not be empty.
 */
export function notEmpty<T>(state: SchemaState<T[]>, options: Options = {}): Criteria<T[]> | void {
	if (__DEV__) {
		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(value.length > 0, options.message ?? 'Array cannot be empty.', path);
			},
		};
	}
}

/**
 * Require field array items to be of a specific schema type.
 * Will rebuild the array and type cast values.
 */
export function of<T>(state: SchemaState<T[]>, itemsSchema: Schema<T>): Criteria<T[]> | void {
	if (__DEV__ && !isSchema(itemsSchema)) {
		invariant(false, 'A schema blueprint is required for array items.');
	}

	state.type += `<${itemsSchema.type()}>`;

	return {
		skipIfNull: true,
		validate(value, path, currentObject, rootObject) {
			if (!Array.isArray(value)) {
				return [];
			}

			const nextValue = [...value];

			value.forEach((item, i) => {
				nextValue[i] = itemsSchema.validate(item, `${path}[${i}]`, currentObject, rootObject);
			});

			return nextValue;
		},
	};
}

/**
 * Require field array to be of a specific size.
 */
export function sizeOf<T>(
	state: SchemaState<T[]>,
	size: number,
	options: Options = {},
): Criteria<T[]> | void {
	if (__DEV__) {
		invariant(typeof size === 'number' && size > 0, 'Size of requires a non-zero positive number.');

		return {
			skipIfNull: true,
			validate(value, path) {
				invariant(value.length === size, options.message ?? `Array length must be ${size}.`, path);
			},
		};
	}
}
