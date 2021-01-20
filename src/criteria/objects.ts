import { invariant, isSchema } from '../helpers';
import { Criteria, Schema, SchemaState } from '../types';

/**
 * Require field object to not be empty.
 */
export function notEmpty<T>(
  state: SchemaState<Record<string, T>>,
): void | Criteria<Record<string, T>> {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(Object.keys(value).length > 0, 'Object cannot be empty.', path);
      },
    };
  }
}

/**
 * Require field object values to be of a specific schema type.
 * Will rebuild the object and type cast values.
 */
export function of<T>(
  state: SchemaState<Record<string, T>>,
  valuesSchema: Schema<T>,
): void | Criteria<Record<string, T>> {
  if (__DEV__) {
    if (!isSchema(valuesSchema)) {
      invariant(false, 'A schema blueprint is required for object values.');
    }
  }

  state.type += `<${valuesSchema.type()}>`;

  return {
    skipIfNull: true,
    validate(value, path, currentObject, rootObject) {
      const nextValue = { ...value };

      Object.keys(value).forEach((baseKey) => {
        const key = baseKey as keyof typeof value;

        nextValue[key] = valuesSchema.validate(
          value[key],
          `${path}.${key}`,
          currentObject,
          rootObject,
        );
      });

      return nextValue;
    },
  };
}

/**
 * Require field object to be of a specific size.
 */
export function sizeOf<T>(
  state: SchemaState<Record<string, T>>,
  size: number,
): void | Criteria<Record<string, T>> {
  if (__DEV__) {
    invariant(typeof size === 'number' && size > 0, 'Size requires a non-zero positive number.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(Object.keys(value).length === size, `Object must have ${size} properties.`, path);
      },
    };
  }
}
