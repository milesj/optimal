import { invariant, pathKey } from '../helpers';
import { CriteriaValidator, SchemaState } from '../types';

/**
 * Map a list of field names that must not be defined alongside this field.
 */
export default function xor<T>(
  state: SchemaState<T>,
  ...keys: string[]
): void | CriteriaValidator<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'XOR requires a list of field names.');

    return (value, path, currentObject) => {
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
