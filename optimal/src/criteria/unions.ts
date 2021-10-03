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
			const error = new ValidationError(
				`Received ${valueType} with the following failures:`,
				path,
				value,
			);

			const passed = schemas.some((schema) => {
				const schemaType = schema.schema();

				if (schemaType === 'union') {
					invalid(false, 'Nested unions are not supported.', path);
				}

				return collectErrors(
					error,
					() => {
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
					},
					true,
				);
			});

			if (!passed) {
				if (error.errors.length > 0) {
					error.throwIfApplicable();
				} else {
					invalid(
						false,
						`Received ${valueType} but value must be one of: ${allowedValues}.`,
						path,
						value,
					);
				}
				// const { length } = collectionError.errors;

				// if (length === 1) {
				// 	// console.log(collectionError);
				// }

				// // When >= 2, always list all errors. When == 1, we want to bubble it up when there
				// // are *no* children, otherwise we need to list out the entire tree!
				// if (
				// 	length >= 2 ||
				// 	(length === 1 && collectionError.errors[0].errors.length > 0) ||
				// 	(length === 1 && collectionError.errors[0].message.startsWith('-'))
				// ) {
				// 	throw collectionError;
				// } else {
				// 	invalid(
				// 		false,
				// 		collectionError.errors[0]?.message ??
				// 			options.message ??
				// 			`Received ${valueType} but value must be one of: ${allowedValues}.`,
				// 		path,
				// 		value,
				// 	);
				// }
			}

			return nextValue;
		},
	};
}
