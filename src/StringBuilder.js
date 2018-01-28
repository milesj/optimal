/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

function isString(value: *): boolean {
  return typeof value === 'string' && value !== '';
}

export default class StringBuilder extends Builder<?string> {
  allowEmpty: boolean = false;

  constructor(defaultValue?: ?string = '') {
    super('string', defaultValue);

    // Not empty by default
    if (__DEV__) {
      this.addCheck(this.checkNotEmpty);
    }
  }

  contains(token: string, index?: number = 0): this {
    if (__DEV__) {
      this.invariant(isString(token), 'Contains requires a non-empty string.');
    }

    return this.addCheck(this.checkContains, token, index);
  }

  checkContains(path: string, value: *, token: string, index?: number = 0) {
    if (__DEV__) {
      this.invariant(value.indexOf(token, index) >= 0, `String does not include "${token}".`, path);
    }
  }

  match(pattern: RegExp): this {
    if (__DEV__) {
      this.invariant(
        pattern instanceof RegExp,
        'Match requires a regular expression to match against.',
      );
    }

    return this.addCheck(this.checkMatch, pattern);
  }

  checkMatch(path: string, value: *, pattern: RegExp) {
    if (__DEV__) {
      this.invariant(
        value.match(pattern),
        `String does not match pattern "${pattern.source}".`,
        path,
      );
    }
  }

  empty(): this {
    if (__DEV__) {
      this.allowEmpty = true;
    }

    return this;
  }

  checkNotEmpty(path: string, value: *) {
    if (__DEV__) {
      if (!this.allowEmpty) {
        this.invariant(isString(value), 'String cannot be empty.', path);
      }
    }
  }

  oneOf(list: string[]): this {
    if (__DEV__) {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isString(item)),
        'One of requires a non-empty array of strings.',
      );
    }

    return this.addCheck(this.checkOneOf, list);
  }

  checkOneOf(path: string, value: *, list: string[]) {
    if (__DEV__) {
      this.invariant(list.indexOf(value) >= 0, `String must be one of: ${list.join(', ')}`, path);
    }
  }
}

export function string(defaultValue?: ?string = ''): StringBuilder {
  return new StringBuilder(defaultValue);
}
