import { invariant, pathKey } from '../helpers';
import { CheckerCallback, PredicateState } from '../types';

/**
 * Map a list of field names that must be defined alongside this field.
 */
export default function and<T>(
  state: PredicateState<T>,
  ...keys: string[]
): void | CheckerCallback<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'AND requires a list of field names.');

    return (value, path, currentObject) => {
      const andKeys = [pathKey(path), ...keys];
      const undefs = andKeys.filter(
        (key) => currentObject[key] === undefined || currentObject[key] === null,
      );

      // Only error once when one of the struct is defined
      if (undefs.length === andKeys.length) {
        return;
      }

      invariant(undefs.length === 0, `All of these fields must be defined: ${andKeys.join(', ')}`);
    };
  }
}
