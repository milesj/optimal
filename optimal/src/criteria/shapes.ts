import { invariant, isObject, isSchema, logUnknown } from '../helpers';
import { Blueprint, Criteria, Schema, SchemaState, UnknownObject } from '../types';

/**
 * Require a shape to be an exact shape.
 * No more and no less of the same properties.
 */
export function exact<T extends object>(state: SchemaState<T>): Criteria<T> | void {
	state.metadata.exact = true;
}

/**
 * Require field to be an object with every property being a schema type.
 * Will rebuild the object (if not a class instance) and type cast values.
 */
export function of<T extends object>(
	state: SchemaState<T>,
	schemas: Blueprint<T>,
): Criteria<T> | void {
	if (__DEV__) {
		invariant(
			isObject(schemas) &&
				Object.keys(schemas).length > 0 &&
				Object.values(schemas).every(isSchema),
			'A non-empty object of schemas are required for a shape.',
		);
	}

	const types = Object.entries(schemas).map(
		([key, value]) => `${key}: ${(value as Schema<unknown>).type()}`,
	);

	state.type += `<{ ${types.join(', ')} }>`;

	return {
		skipIfNull: true,
		validate(value, path, currentObject, rootObject) {
			if (__DEV__ && value) {
				invariant(isObject(value), 'Value passed to shape must be an object.', path);
			}

			const isPlainObject = value.constructor === Object;
			const unknown: Partial<T> = isPlainObject ? { ...value } : {};
			const shape: Partial<T> = {};

			Object.keys(schemas).forEach((prop) => {
				const key = prop as keyof T;
				const schema = schemas[key];

				shape[key] = schema.validate(
					value[key],
					path ? `${path}.${key}` : String(key),
					value as UnknownObject,
					rootObject,
				);

				// Delete the prop and mark it as known
				delete unknown[key];
			});

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
