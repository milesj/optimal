import { invalid, invariant, isObject, isSchema, logUnknown, tryAndCollect } from '../helpers';
import { Blueprint, Criteria, Schema, SchemaState, UnknownObject } from '../types';
import { ValidationError } from '../ValidationError';

/**
 * Require a shape to be an exact shape.
 * No more and no less of the same properties.
 */
export function exact<T extends object>(state: SchemaState<T>, value: boolean = true) {
	state.metadata.exact = value;
}

/**
 * Require field to be an object with every property being a schema type.
 * Will rebuild the object (if not a class instance) and type cast values.
 */
export function of<T extends object>(state: SchemaState<T>, schemas: Blueprint<T>): Criteria<T> {
	invariant(
		isObject(schemas) && Object.keys(schemas).length > 0 && Object.values(schemas).every(isSchema),
		'A non-empty object of schemas are required for a shape.',
	);

	const types = Object.entries(schemas).map(
		([key, value]) => `${key}: ${(value as Schema<unknown>).type()}`,
	);

	state.type += `<{ ${types.join(', ')} }>`;

	return {
		skipIfNull: true,
		validate(value, path, validateOptions) {
			if (value) {
				invalid(isObject(value), 'Value passed to shape must be an object.', path, value);
			}

			const isPlainObject = value.constructor === Object;
			const unknown: Partial<T> = isPlainObject ? { ...value } : {};
			const shape: Partial<T> = {};
			const collectionError = new ValidationError(
				'The following validations have failed:',
				path,
				value,
			);

			Object.keys(schemas).forEach((prop) => {
				const key = prop as keyof T;
				const schema = schemas[key];

				tryAndCollect(
					() => {
						shape[key] = schema.validate(value[key], path ? `${path}.${key}` : String(key), {
							...validateOptions,
							currentObject: value as UnknownObject,
						});
					},
					collectionError,
					validateOptions.collectErrors,
				);

				// Delete the prop and mark it as known
				delete unknown[key];
			});

			if (collectionError.errors.length > 0) {
				throw collectionError;
			}

			// Handle unknown fields
			if (state.metadata.exact) {
				if (__DEV__) {
					logUnknown(unknown, path);
				}
			} else {
				Object.assign(shape, unknown);
			}

			// Dont replace class instance with plain objects
			return isPlainObject ? shape : value;
		},
	};
}
