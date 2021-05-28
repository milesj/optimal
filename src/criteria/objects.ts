import { invariant, isObject, isSchema } from '../helpers';
import { Criteria, Options, Schema, SchemaState } from '../types';

/**
 * Require field object to not be empty.
 */
export function notEmpty<T>(
  state: SchemaState<Record<string, T>>,
  options: Options = {},
): Criteria<Record<string, T>> | void {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(
          Object.keys(value).length > 0,
          options.message || 'Object cannot be empty.',
          path,
        );
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
): Criteria<Record<string, T>> | void {
  if (__DEV__) {
    if (!isSchema(valuesSchema)) {
      invariant(false, 'A schema blueprint is required for object values.');
    }
  }

  state.type += `<${valuesSchema.type()}>`;

  return {
    skipIfNull: true,
    validate(value, path, currentObject, rootObject) {
      if (!isObject(value)) {
        return {};
      }

      const nextValue = { ...value };

      Object.keys(value).forEach((baseKey) => {
        const key = baseKey!;

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
  options: Options = {},
): Criteria<Record<string, T>> | void {
  if (__DEV__) {
    invariant(typeof size === 'number' && size > 0, 'Size requires a non-zero positive number.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(
          Object.keys(value).length === size,
          options.message || `Object must have ${size} properties.`,
          path,
        );
      },
    };
  }
}
