import { invariant } from '../helpers';
import { CriteriaValidator, CustomCallback, SchemaState } from '../types';

/**
 * Set a callback to run custom validation logic.
 */
export default function custom<T>(
  state: SchemaState<T>,
  callback: CustomCallback<T>,
): void | CriteriaValidator<T> {
  if (__DEV__) {
    invariant(typeof callback === 'function', 'Custom requires a validation function.');

    return (value, path, currentObject, rootObject) => {
      try {
        callback(value, currentObject, rootObject);
      } catch (error) {
        invariant(false, error.message, path);
      }
    };
  }
}
