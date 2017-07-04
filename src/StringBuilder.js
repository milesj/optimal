/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

function isString(value: *): boolean {
  return (typeof value === 'string' && value !== '');
}

export default class StringBuilder extends Builder<string> {
  constructor(defaultValue: string = '') {
    super('string', defaultValue);

    // Only allow strings
    this.required();
  }

  contains(token: string, index: number = 0): this {
    if (__DEV__) {
      invariant(
        isString(token),
        'string.contains() requires a non-empty string.',
      );
    }

    return this.addCheck(this.checkContains, token, index);
  }

  checkContains(path: string, value: *, token: string, index: number = 0) {
    if (__DEV__) {
      invariant(value.includes(token, index), `String does not include "${token}".`, path);
    }
  }

  match(pattern: RegExp): this {
    if (__DEV__) {
      invariant(
        (pattern instanceof RegExp),
        'string.match() requires a regular expression to match against.',
      );
    }

    return this.addCheck(this.checkMatch, pattern);
  }

  checkMatch(path: string, value: *, pattern: RegExp) {
    if (__DEV__) {
      invariant(value.match(pattern), `String does not match pattern "${pattern.source}".`, path);
    }
  }

  notEmpty(): this {
    return this.addCheck(this.checkNotEmpty);
  }

  checkNotEmpty(path: string, value: *) {
    if (__DEV__) {
      invariant((value !== ''), 'String cannot be empty.', path);
    }
  }

  oneOf(list: string[] = []): this {
    if (__DEV__) {
      invariant(
        (Array.isArray(list) && list.length > 0 && list.every(isString)),
        'string.oneOf() requires a non-empty array of strings.',
      );
    }

    return this.addCheck(this.checkOneOf, list);
  }

  checkOneOf(path: string, value: *, list: string[] = []) {
    if (__DEV__) {
      invariant(list.includes(value), `String must be one of: ${list.join(', ')}`, path);
    }
  }
}

export function string(defaultValue: string = ''): StringBuilder {
  return new StringBuilder(defaultValue);
}
