import { invariant, pathKey } from '../helpers';
import { CriteriaState, CustomCallback, SchemaState } from '../types';

/**
 * Map a list of field names that must be defined alongside this field.
 */
export function and<T>(state: SchemaState<T>, ...keys: string[]): void | CriteriaState<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'AND requires a list of field names.');

    return {
      validate(value, path, currentObject) {
        const andKeys = [pathKey(path), ...keys];
        const undefs = andKeys.filter(
          (key) => currentObject[key] === undefined || currentObject[key] === null,
        );

        // Only error once when one of the struct is defined
        if (undefs.length === andKeys.length) {
          return;
        }

        invariant(
          undefs.length === 0,
          `All of these fields must be defined: ${andKeys.join(', ')}`,
        );
      },
    };
  }
}

/**
 * Set a callback to run custom validation logic.
 */
export function custom<T>(
  state: SchemaState<T>,
  callback: CustomCallback<T>,
): void | CriteriaState<T> {
  if (__DEV__) {
    invariant(typeof callback === 'function', 'Custom requires a validation function.');

    return {
      validate(value, path, currentObject, rootObject) {
        try {
          callback(value, currentObject, rootObject);
        } catch (error) {
          invariant(false, error.message, path);
        }
      },
    };
  }
}

/**
 * Set a message to log when this field is present.
 */
export function deprecate<T>(state: SchemaState<T>, message: string) {
  if (__DEV__) {
    invariant(
      typeof message === 'string' && !!message,
      'A non-empty string is required for deprecated messages.',
    );

    state.metadata.deprecatedMessage = message;
  }
}

/**
 * Mark that this field should never be used.
 */
export function never<T>(state: SchemaState<T>) {
  state.defaultValue = undefined;
  state.never = true;
}

/**
 * Disallow null values.
 */
export function nonNullable<T>(state: SchemaState<T>) {
  state.nullable = false;
}

/**
 * Require this field to NOT be explicitly defined.
 */
export function nonRequired<T>(state: SchemaState<T>) {
  state.required = false;
}

/**
 * Allow null values.
 */
export function nullable<T>(state: SchemaState<T>) {
  state.nullable = true;
}

/**
 * Mark that this field can ONLY use a value that matches the default value.
 */
export function only<T>(state: SchemaState<T>): void | CriteriaState<T> {
  if (__DEV__) {
    const { defaultValue } = state;

    invariant(
      defaultValue !== null && defaultValue !== undefined,
      'Only requires a non-empty default value.',
    );

    invariant(
      // eslint-disable-next-line valid-typeof
      typeof defaultValue === state.type,
      `Only requires a default value of type ${state.type}.`,
    );

    return {
      validate(value, path) {
        invariant(value === defaultValue, `Value may only be "${String(defaultValue)}".`, path);
      },
    };
  }
}

/**
 * Map a list of field names that must have at least 1 defined.
 */
export function or<T>(state: SchemaState<T>, ...keys: string[]): void | CriteriaState<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'OR requires a list of field names.');

    return {
      validate(value, path, currentObject) {
        const orKeys = [pathKey(path), ...keys];
        const defs = orKeys.filter(
          (key) => currentObject[key] !== undefined && currentObject[key] !== null,
        );

        invariant(
          defs.length > 0,
          `At least one of these fields must be defined: ${orKeys.join(', ')}`,
        );
      },
    };
  }
}

/**
 * Require this field to be explicitly defined.
 */
export function required<T>(state: SchemaState<T>) {
  state.required = true;
}

/**
 * Map a list of field names that must not be defined alongside this field.
 */
export function xor<T>(state: SchemaState<T>, ...keys: string[]): void | CriteriaState<T> {
  if (__DEV__) {
    invariant(keys.length > 0, 'XOR requires a list of field names.');

    return {
      validate(value, path, currentObject) {
        const xorKeys = [pathKey(path), ...keys];
        const defs = xorKeys.filter(
          (key) => currentObject[key] !== undefined && currentObject[key] !== null,
        );

        invariant(
          defs.length === 1,
          `Only one of these fields may be defined: ${xorKeys.join(', ')}`,
        );
      },
    };
  }
}
