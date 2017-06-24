/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import invariant from './invariant';
import isObject from './isObject';

import type { SupportedType, Checker } from './types';

export default class Builder<T> {
  checks: {
    args: *[],
    func: Checker,
  }[];
  defaultValue: T;
  type: SupportedType;

  constructor(type: SupportedType, defaultValue: T) {
    if (typeof defaultValue === 'undefined') {
      throw new TypeError(`A default value for type "${type}" is required.`);
    }

    this.checks = [];
    this.defaultValue = defaultValue;
    this.type = type;

    this.addCheck(this.checkTypeOf);
  }

  /**
   * Add a checking function with optional arguments.
   */
  addCheck(func: Checker, ...args: *[]): this {
    this.checks.push({
      args,
      func,
    });

    return this;
  }

  /**
   * Run all validation checks that have been enqueued.
   */
  runChecks(path: string, initialValue: *): * {
    const value = (typeof initialValue === 'undefined') ? this.defaultValue : initialValue;

    this.checks.forEach((checker) => {
      checker.func.call(this, path, value, ...checker.args);
    });

    return value;
  }

  /**
   * Validate the type of value.
   */
  checkTypeOf(path: string, value: *) {
    switch (this.type) {
      case 'array':
        return invariant(Array.isArray(value), 'Must be an array.', path);

      case 'object':
        return invariant(isObject(value), 'Must be a plain object.', path);

      default:
        // eslint-disable-next-line valid-typeof
        return invariant((typeof value === this.type), `Must be a ${this.type}.`, path);
    }
  }
}
