import { invalid, invariant, isSchema } from '../helpers';
import { Criteria, Options, Schema, SchemaState } from '../types';

/**
 * Require field array to not be empty.
 */
export function notEmpty<T>(state: SchemaState<T[]>, options: Options = {}): Criteria<T[]> {
	return {
		validate(value, path) {
			invalid(value.length > 0, options.message ?? 'Array cannot be empty.', path, value);
		},
	};
}

/**
 * Require field array items to be of a specific schema type.
 * Will rebuild the array and type cast values.
 */
export function of<T>(state: SchemaState<T[]>, itemsSchema: Schema<T>): Criteria<T[]> {
	invariant(isSchema(itemsSchema), 'A schema is required for array items.');

	state.type += `<${itemsSchema.type()}>`;

	return {
		validate(value, path, validateOptions) {
			if (!Array.isArray(value)) {
				return [];
			}

			const nextValue = [...value];

			value.forEach((item, i) => {
				nextValue[i] = itemsSchema.validate(item, `${path}[${i}]`, validateOptions);
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
): Criteria<T[]> {
	invariant(typeof size === 'number' && size > 0, 'Size of requires a non-zero positive number.');

	return {
		validate(value, path) {
			invalid(
				value.length === size,
				options.message ?? `Array length must be ${size}, received ${value.length}.`,
				path,
				value,
			);
		},
	};
}
