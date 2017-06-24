/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import invariant from './invariant';
import isObject from './isObject';

import type { SupportedType, Checker } from './types';

export default class Builder<T> {
  defaultValue: T;
  checks: Checker[];
  type: SupportedType;

  constructor(type: SupportedType, defaultValue: T) {
    if (typeof defaultValue === 'undefined') {
      throw new TypeError(`A default value for type "${type}" is required.`);
    }

    this.defaultValue = defaultValue;
    this.checks = [this.checkTypeOf];
    this.type = type;
  }

  /**
   * Run all validation checks that have been enqueued.
   */
  runChecks(path: string, initialValue: *): * {
    const value = (typeof initialValue === 'undefined') ? this.defaultValue : initialValue;

    this.checks.forEach((check) => {
      check.call(this, path, value);
    });

    return value;
  }

  /**
   * Validate the type of value.
   */
  checkTypeOf(path: string, value: *) {
    switch (this.type) {
      case 'array':
        return invariant(Array.isArray(value), path, 'Must be an array.');

      case 'object':
        return invariant(isObject(value), path, 'Must be a plain object.');

      default:
        // eslint-disable-next-line valid-typeof
        return invariant((typeof value === this.type), path, `Must be a ${this.type}.`);
    }
  }
}
