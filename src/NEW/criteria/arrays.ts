import { invariant } from '../helpers';
import { CriteriaValidator, SchemaState } from '../types';

/**
 * Require field array to not be empty.
 */
export function notEmpty<T>(state: SchemaState<T[]>): void | CriteriaValidator<T[]> {
  if (__DEV__) {
    return (value, path) => {
      if (state.nullable && value === null) {
        return;
      }

      invariant(value.length > 0, 'Array cannot be empty.', path);
    };
  }
}

/**
 * Require field array to be of a specific size.
 */
export function sizeOf<T>(state: SchemaState<T[]>, size: number): void | CriteriaValidator<T[]> {
  if (__DEV__) {
    invariant(typeof size === 'number' && size > 0, 'Size requires a non-zero positive number.');

    return (value, path) => {
      if (state.nullable && value === null) {
        return;
      }

      invariant(value.length === size, `Array length must be ${size}.`, path);
    };
  }
}
