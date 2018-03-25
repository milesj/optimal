/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import { SupportedType } from './types';

function isString(value: any): boolean {
  return typeof value === 'string' && value !== '';
}

export default class StringBuilder extends Builder<string | null> {
  allowEmpty: boolean = false;

  constructor(defaultValue: string | null = '') {
    super(SupportedType.String, defaultValue);

    // Not empty by default
    if (process.env.NODE_ENV !== 'production') {
      this.addCheck(this.checkNotEmpty);
    }
  }

  contains(token: string, index: number = 0): this {
    if (process.env.NODE_ENV !== 'production') {
      this.invariant(isString(token), 'Contains requires a non-empty string.');
    }

    return this.addCheck(this.checkContains, token, index);
  }

  checkContains(path: string, value: any, token: string, index: number = 0) {
    if (process.env.NODE_ENV !== 'production') {
      this.invariant(value.indexOf(token, index) >= 0, `String does not include "${token}".`, path);
    }
  }

  match(pattern: RegExp): this {
    if (process.env.NODE_ENV !== 'production') {
      this.invariant(
        pattern instanceof RegExp,
        'Match requires a regular expression to match against.',
      );
    }

    return this.addCheck(this.checkMatch, pattern);
  }

  checkMatch(path: string, value: any, pattern: RegExp) {
    if (process.env.NODE_ENV !== 'production') {
      this.invariant(
        value.match(pattern),
        `String does not match pattern "${pattern.source}".`,
        path,
      );
    }
  }

  empty(): this {
    if (process.env.NODE_ENV !== 'production') {
      this.allowEmpty = true;
    }

    return this;
  }

  checkNotEmpty(path: string, value: any) {
    if (process.env.NODE_ENV !== 'production') {
      if (!this.allowEmpty) {
        this.invariant(isString(value), 'String cannot be empty.', path);
      }
    }
  }

  oneOf(list: string[]): this {
    if (process.env.NODE_ENV !== 'production') {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isString(item)),
        'One of requires a non-empty array of strings.',
      );
    }

    return this.addCheck(this.checkOneOf, list);
  }

  checkOneOf(path: string, value: any, list: string[]) {
    if (process.env.NODE_ENV !== 'production') {
      this.invariant(list.indexOf(value) >= 0, `String must be one of: ${list.join(', ')}`, path);
    }
  }
}

export function string(defaultValue: string | null = ''): StringBuilder {
  return new StringBuilder(defaultValue);
}
