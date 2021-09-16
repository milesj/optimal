import { invalid, invariant, isObject, isSchema, logUnknown } from '../helpers';
import { Blueprint, Criteria, Schema, SchemaState, UnknownObject } from '../types';
import { ValidationError } from '../ValidationError';

/**
 * Require a shape to be an exact. No more and no less of the same properties.
 */
export function exact<T extends object>(state: SchemaState<T>, value: boolean = true) {
	state.metadata.exact = value;
}

/**
 * Require field to be an object with every property being a schema type.
 * Will rebuild the object (if not a class instance) and type cast values.
 * @internal
 */
export function of<T extends object>(state: SchemaState<T>, schemas: Blueprint<T>): Criteria<T> {
	invariant(
		isObject(schemas) && Object.values(schemas).every(isSchema),
		'An object of schemas are required for a blueprint.',
	);

	const types = Object.entries(schemas).map(
		([key, value]) => `${key}: ${(value as Schema<unknown>).type()}`,
	);

	state.type += `<{ ${types.join(', ')} }>`;

	return {
		validate(value, path, validateOptions) {
			if (value) {
				invalid(isObject(value), 'Value passed to shape must be an object.', path, value);
			}

			const isPlainObject = value.constructor === Object;
			const unknown: Partial<T> = isPlainObject ? { ...value } : {};
			const shape: Partial<T> = {};
			const errors: Error[] = [];
			const currentValidateOptions = {
				...validateOptions,
				currentObject: value as UnknownObject,
			};

			Object.keys(schemas).forEach((prop) => {
				const key = prop as keyof T;
				const schema = schemas[key];
				const schemaState = schema.state();
				const currentPath = path ? `${path}.${key}` : String(key);

				try {
					if (schemaState.required) {
						invalid(
							key in value && value[key] !== undefined,
							schemaState.metadata.requiredMessage ?? 'Field is required and must be defined.',
							currentPath,
							undefined,
						);
					}

					shape[key] = schema.validate(value[key], currentPath, currentValidateOptions);
				} catch (error: unknown) {
					if (error instanceof Error) {
						errors.push(error);
					}
				}

				// Delete the prop and mark it as known
				delete unknown[key];
			});

			if (errors.length > 0) {
				throw new ValidationError(errors, path, value);
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
