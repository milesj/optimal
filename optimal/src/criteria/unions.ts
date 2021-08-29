import { invariant, isObject, isSchema } from '../helpers';
import { Criteria, Schema, SchemaState } from '../types';

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
		validate(value, path, currentObject, rootObject) {
			let nextValue: unknown = value;

			if (__DEV__) {
				const allowedValues = schemas.map((schema) => schema.type()).join(', ');
				const valueType = typeOf(value);
				const errors = new Set<string>();

				// eslint-disable-next-line complexity
				const passed = schemas.some((schema) => {
					const schemaType = schema.schema();

					if (schemaType === 'union') {
						invariant(false, 'Nested unions are not supported.', path);
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
							nextValue = schema.validate(value, path, currentObject, rootObject);

							return true;
						}

						return false;
					} catch (error: unknown) {
						if (error instanceof Error) {
							errors.add(` - ${error.message}\n`);
						}
					}

					return false;
				});

				if (!passed) {
					let message = `Value must be one of: ${allowedValues}.`;

					if (errors.size > 0) {
						message += ` Received ${valueType} with the following invalidations:\n`;

						errors.forEach((error) => {
							message += error;
						});
					}

					invariant(false, message.trim(), path);
				}
			}

			return nextValue;
		},
	};
}
