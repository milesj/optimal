import { invariant } from '../helpers';
import { CheckerCallback, CustomCallback, PredicateState } from '../types';

/**
 * Set a callback to run custom validation logic.
 */
export default function custom<T>(
  state: PredicateState<T>,
  callback: CustomCallback<T>,
): void | CheckerCallback<T> {
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
