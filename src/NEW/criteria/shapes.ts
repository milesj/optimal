import { invariant, isObject, isSchema, logUnknown } from '../helpers';
import { Blueprint, Criteria, SchemaState } from '../types';

/**
 * Require a shape to be an exact shape.
 * No more and no less of the same properties.
 */
export function exact<T extends object>(state: SchemaState<T>): void | Criteria<T> {
  state.metadata.exact = true;
}

/**
 * Require field to be an object with every property being a schema type.
 * Will rebuild the object (if not a class instance) and type cast values.
 */
export function of<T extends object>(
  state: SchemaState<T>,
  schemas: Blueprint<T>,
): void | Criteria<T> {
  if (__DEV__) {
    invariant(
      isObject(schemas) &&
        Object.keys(schemas).length > 0 &&
        Object.values(schemas).every(isSchema),
      'A non-empty object of schemas are required for a shape.',
    );
  }

  return {
    skipIfNull: true,
    validate(value, path, currentObject, rootObject) {
      if (__DEV__ && value) {
        invariant(isObject(value), 'Value passed to shape must be an object.', path);
      }

      const isPlainObject = value.constructor === Object;
      const unknown: Partial<T> = isPlainObject ? { ...value } : {};
      const shape: Partial<T> = {};

      Object.entries(schemas).forEach(([prop, schema]) => {
        const key = prop as keyof T;

        shape[key] = schema.validate(value?.[key], `${path}.${key}`, value, rootObject);

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
