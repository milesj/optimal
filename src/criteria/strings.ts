import { invariant, isValidString } from '../helpers';
import { Criteria, SchemaState } from '../types';

/**
 * Require field value to contain a provided string.
 */
export function contains(
  state: SchemaState<string>,
  token: string,
  index: number = 0,
): Criteria<string> | void {
  if (__DEV__) {
    invariant(isValidString(token), 'Contains requires a non-empty token.');

    return {
      skipIfNull: true,
      skipIfOptional: true,
      validate(value, path) {
        invariant(value.includes(token, index), `String does not include "${token}".`, path);
      },
    };
  }
}

/**
 * Require field value to match a defined regex pattern.
 */
export function match(
  state: SchemaState<string>,
  pattern: RegExp,
  message: string = '',
): Criteria<string> | void {
  if (__DEV__) {
    invariant(pattern instanceof RegExp, 'Match requires a regular expression to match against.');

    return {
      skipIfNull: true,
      skipIfOptional: true,
      validate(value, path) {
        invariant(
          !!value.match(pattern),
          `${message || 'String does not match.'} (pattern "${pattern.source}")`,
          path,
        );
      },
    };
  }
}

/**
 * Require field value to be formatted in camel case (fooBar).
 */
export function camelCase(state: SchemaState<string>): Criteria<string> | void {
  return match(state, /^[a-z][a-zA-Z0-9]+$/u, 'String must be in camel case.');
}

/**
 * Require field value to be formatted in kebab case (foo-bar).
 */
export function kebabCase(state: SchemaState<string>): Criteria<string> | void {
  return match(state, /^[a-z][a-z0-9-]+$/u, 'String must be in kebab case.');
}

/**
 * Require field value to be formatted in pascal case (FooBar).
 */
export function pascalCase(state: SchemaState<string>): Criteria<string> | void {
  return match(state, /^[A-Z][a-zA-Z0-9]+$/u, 'String must be in pascal case.');
}

/**
 * Require field value to be formatted in snake case (foo_bar).
 */
export function snakeCase(state: SchemaState<string>): Criteria<string> | void {
  return match(state, /^[a-z][a-z0-9_]+$/u, 'String must be in snake case.');
}

/**
 * Require field value to not be an empty string.
 */
export function notEmpty(): Criteria<string> | void {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(isValidString(value), 'String cannot be empty.', path);
      },
    };
  }
}

/**
 * Require field value to be one of the provided string.
 */
export function oneOf(state: SchemaState<string>, list: string[]): Criteria<string> | void {
  if (__DEV__) {
    invariant(
      Array.isArray(list) && list.length > 0 && list.every((item) => isValidString(item)),
      'One of requires a non-empty array of strings.',
    );

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(list.includes(value), `String must be one of: ${list.join(', ')}`, path);
      },
    };
  }
}

/**
 * Require field value to be all lower case.
 */
export function lowerCase(): Criteria<string> | void {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(value === value.toLocaleLowerCase(), 'String must be lower cased.', path);
      },
    };
  }
}

/**
 * Require field value to be all upper case.
 */
export function upperCase(): Criteria<string> | void {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(value === value.toLocaleUpperCase(), 'String must be upper cased.', path);
      },
    };
  }
}

/**
 * Require field array to be of a specific size.
 */
export function sizeOf(state: SchemaState<string>, size: number): Criteria<string> | void {
  if (__DEV__) {
    invariant(typeof size === 'number' && size > 0, 'Size requires a non-zero positive number.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(value.length === size, `String length must be ${size}.`, path);
      },
    };
  }
}
