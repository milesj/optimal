import { invariant } from '../helpers';
import { Criteria, SchemaState } from '../types';

/**
 * Require this field to only be false.
 */
export function onlyFalse(state: SchemaState<boolean>): void | Criteria<boolean> {
  state.defaultValue = false;

  if (__DEV__) {
    return {
      validate(value, path) {
        invariant(value === false, 'May only be `false`.', path);
      },
    };
  }
}

/**
 * Require this field to only be true.
 */
export function onlyTrue(state: SchemaState<boolean>): void | Criteria<boolean> {
  state.defaultValue = true;

  if (__DEV__) {
    return {
      validate(value, path) {
        invariant(value === true, 'May only be `true`.', path);
      },
    };
  }
}
