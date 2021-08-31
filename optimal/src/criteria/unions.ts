import { invalid, invariant, isObject, isSchema } from '../helpers';
import { Criteria, Schema, SchemaState } from '../types';
import { ValidationError } from '../ValidationError';

function typeOf(value: unknown): string {
	if (Array.isArray(value)) {
		return 'array/tuple';
	}

	if (isObject(value)) {
		return value.constructor === Object ? 'object/shape' : 'class';
	}

	return typeof value;
}

/**
 * Require field value to be one of a specific schema type.
 */
export function of<T = unknown>(
	state: SchemaState<T>,
	schemas: Schema<unknown>[],
): Criteria<T> | void {
	if (__DEV__) {
		invariant(
			Array.isArray(schemas) && schemas.length > 0 && schemas.every(isSchema),
			'A non-empty array of schemas are required for a union.',
		);
	}

	state.type = schemas.map((item) => item.type()).join(' | ');

	return {
		skipIfNull: true,
		validate(value, path, validateOptions) {
			let nextValue: unknown = value;

			if (__DEV__) {
				const allowedValues = schemas.map((schema) => schema.type()).join(', ');
				const valueType = typeOf(value);
				const collectionError = new ValidationError(
					`Received ${valueType} with the following failures:`,
					path,
					value,
				);

				// eslint-disable-next-line complexity
				const passed = schemas.some((schema) => {
					const schemaType = schema.schema();

					if (schemaType === 'union') {
						invalid(false, 'Nested unions are not supported.', path);
					}

					try {
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
					} catch (error: unknown) {
						if (error instanceof Error && validateOptions.collectErrors) {
							collectionError.addError(error);
						} else {
							throw error;
						}
					}

					return false;
				});

				if (!passed) {
					if (collectionError.errors.length > 0) {
						throw collectionError;
					} else {
						invalid(false, `Value must be one of: ${allowedValues}.`, path, value);
					}
				}
			}

			return nextValue;
		},
	};
}
