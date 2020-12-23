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
    invariant(typeof callback === 'function', 'Custom blueprints require a validation function.');

    return (path, value) => {
      try {
        callback(value, {}); // TODO
      } catch (error) {
        invariant(false, error.message, path);
      }
    };
  }
}
