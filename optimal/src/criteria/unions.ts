import { collectErrors, invalid, invariant, isSchema, typeOf } from '../helpers';
import { Criteria, Options, Schema, SchemaState } from '../types';
import { ValidationError } from '../ValidationError';

/**
 * Require field value to be one of a specific schema type.
 */
export function of<T = unknown>(
	state: SchemaState<T>,
	schemas: Schema<unknown>[],
	options: Options = {},
): Criteria<T> {
	invariant(
		Array.isArray(schemas) && schemas.length > 0 && schemas.every(isSchema),
		'A non-empty array of schemas are required for a union.',
	);

	state.type = schemas.map((item) => item.type()).join(' | ');

	return {
		validate(value, path, validateOptions) {
			let nextValue: unknown = value;
			const allowedValues = schemas.map((schema) => schema.type()).join(', ');
			const valueType = typeOf(value);
			const collectionError = new ValidationError(
				`Received ${valueType} with the following failures:`,
				path,
				value,
			);

			const passed = schemas.some((schema) => {
				const schemaType = schema.schema();

				if (schemaType === 'union') {
					invalid(false, 'Nested unions are not supported.', path);
				}

				return collectErrors(collectionError, () => {
					if (
						valueType === schemaType ||
						(valueType === 'object/shape' && schemaType === 'object') ||
						(valueType === 'object/shape' && schemaType === 'shape') ||
						(valueType === 'array/tuple' && schemaType === 'array') ||
						(valueType === 'array/tuple' && schemaType === 'tuple') ||
						schemaType === 'custom'
					) {
						// Dont pass path so its not included in the error message
						nextValue = schema.validate(value, '', validateOptions);

						return true;
					}

					return false;
				});
			});

			if (!passed) {
				if (collectionError.errors.length > 0) {
					throw collectionError;
				} else {
					invalid(
						false,
						options.message ?? `Received ${valueType} but value must be one of: ${allowedValues}.`,
						path,
						value,
					);
				}
			}

			return nextValue;
		},
	};
}
