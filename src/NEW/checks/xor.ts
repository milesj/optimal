import { invariant, pathKey } from '../helpers';
import { CheckerCallback, PredicateState } from '../types';

/**
 * Map a list of field names that must not be defined alongside this field.
 */
export default function xor<T>(
  state: PredicateState<T>,
  ...keys: string[]
): void | CheckerCallback<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'XOR requires a list of field names.');

    return (path, value, currentObject) => {
      const xorKeys = [pathKey(path), ...keys];
      const defs = xorKeys.filter(
        (key) => currentObject[key] !== undefined && currentObject[key] !== null,
      );

      invariant(
        defs.length === 1,
        `Only one of these fields may be defined: ${xorKeys.join(', ')}`,
      );
    };
  }
}
