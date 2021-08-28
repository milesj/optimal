import { invariant, isObject, isSchema } from '../helpers';
import { Criteria, Schema, SchemaState } from '../types';

export type InferUnionItems<T> =
  // We need to handle boolean explicitly, otherwise it distributes as "false" and "true" separately
  T extends boolean
    ? Schema<boolean>
    : // We also shouldnt allow "null" schemas, so filter out
    T extends null
    ? never
    : // Otherwise everything else should be a schema
    T extends unknown
    ? Schema<T>
    : never;

function typeOf(value: unknown): string {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === typeof value[0]) ? 'array' : 'union';
  }

  if (isObject(value)) {
    return value.constructor === Object ? 'object' : 'instance';
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
      'A non-empty array of blueprints are required for a union.',
    );
  }

  state.type = schemas.map((item) => item.type()).join(' | ');

  return {
    skipIfNull: true,
    validate(value, path, currentObject, rootObject) {
      let nextValue: unknown = value;

      if (__DEV__) {
        const keys = schemas.map((schema) => schema.type()).join(', ');
        const valueType = typeOf(value);
        const errors = new Set();
        const passed = schemas.some((schema) => {
          const schemaType = schema.type();

          if (schemaType === 'union') {
            invariant(false, 'Nested unions are not supported.', path);
          }

          try {
            if (
              valueType === schemaType ||
              (valueType === 'object' && schemaType === 'shape') ||
              (valueType === 'array' && schemaType === 'tuple') ||
              schemaType === 'custom'
            ) {
              nextValue = schema.validate(value, path, currentObject, rootObject);

              return true;
            }

            return false;
          } catch (error) {
            errors.add(` - ${error.message}\n`);
          }

          return false;
        });

        if (!passed && errors.size > 0) {
          let message = `Value must be one of: ${keys}. Received ${valueType} with the following invalidations:\n`;

          errors.forEach((error) => {
            message += error;
          });

          invariant(false, message.trim(), path);
        }
      }

      return nextValue;
    },
  };
}
