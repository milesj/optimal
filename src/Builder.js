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
  }[] = [];
  defaultValue: T;
  nullable: boolean = true;
  type: SupportedType;

  constructor(type: SupportedType, defaultValue: T) {
    if (typeof defaultValue === 'undefined') {
      throw new TypeError(`A default value for type "${type}" is required.`);
    }

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
   * Validate the value matches only the default value.
   */
  checkOnly(path: string, value: *) {
    invariant(
      (value === this.defaultValue),
      `Value may only be "${String(this.defaultValue)}".`,
      path,
    );
  }

  /**
   * Validate the type of value.
   */
  checkTypeOf(path: string, value: *) {
    switch (this.type) {
      case 'array':
        invariant(Array.isArray(value), 'Must be an array.', path);
        break;

      case 'instance':
        // Handle in the sub-class
        break;

      case 'object':
        invariant(isObject(value), 'Must be a plain object.', path);
        break;

      case 'regex':
        invariant((value instanceof RegExp), 'Must be a `RegExp`.', path);
        break;

      default:
        // eslint-disable-next-line valid-typeof
        invariant((typeof value === this.type), `Must be a ${this.type}.`, path);
        break;
    }
  }

  /**
   * Mark a field as only the default value can be used.
   */
  only(): this {
    invariant(
      // eslint-disable-next-line valid-typeof
      (typeof this.defaultValue === this.type),
      `only() requires a default ${this.type} value.`,
    );

    return this.addCheck(this.checkOnly);
  }

  /**
   * Mark a field as required and disallow nulls.
   */
  required(): this {
    this.nullable = false;

    return this;
  }

  /**
   * Run all validation checks that have been enqueued.
   */
  runChecks(path: string, initialValue: *): * {
    const value = (typeof initialValue === 'undefined') ? this.defaultValue : initialValue;

    // If nullable, just abort early
    if (value === null && this.nullable) {
      return value;
    }

    // Run all checks against the value
    this.checks.forEach((checker) => {
      checker.func.call(this, path, value, ...checker.args);
    });

    return value;
  }
}
