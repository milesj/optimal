import { invariant, pathKey } from '../helpers';
import { CriteriaValidator, SchemaState } from '../types';

/**
 * Map a list of field names that must have at least 1 defined.
 */
export default function or<T>(
  state: SchemaState<T>,
  ...keys: string[]
): void | CriteriaValidator<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'OR requires a list of field names.');

    return (value, path, currentObject) => {
      const orKeys = [pathKey(path), ...keys];
      const defs = orKeys.filter(
        (key) => currentObject[key] !== undefined && currentObject[key] !== null,
      );

      invariant(
        defs.length > 0,
        `At least one of these fields must be defined: ${orKeys.join(', ')}`,
      );
    };
  }
}
