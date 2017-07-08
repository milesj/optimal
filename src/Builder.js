/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './isObject';

import type { SupportedType, Checker, Config } from './types';

export default class Builder<T> {
  checks: {
    args: *[],
    func: Checker,
  }[] = [];
  currentConfig: Config = {};
  defaultValue: T;
  errorMessage: string = '';
  isNullable: boolean = false;
  isRequired: boolean = false;
  type: SupportedType;

  constructor(type: SupportedType, defaultValue: T) {
    if (__DEV__) {
      this.invariant(
        (typeof defaultValue !== 'undefined'),
        `A default value for type "${type}" is required.`,
      );
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
    if (__DEV__) {
      this.invariant(
        (value === this.defaultValue),
        `Value may only be "${String(this.defaultValue)}".`,
        path,
      );
    }
  }

  /**
   * Validate the type of value.
   */
  checkTypeOf(path: string, value: *) {
    if (__DEV__) {
      switch (this.type) {
        case 'array':
          this.invariant(Array.isArray(value), 'Must be an array.', path);
          break;

        case 'custom':
        case 'instance':
        case 'union':
          // Handle in the sub-class
          break;

        case 'object':
        case 'shape':
          this.invariant(isObject(value), 'Must be a plain object.', path);
          break;

        default:
          // eslint-disable-next-line valid-typeof
          this.invariant((typeof value === this.type), `Must be a ${this.type}.`, path);
          break;
      }
    }
  }

  /**
   * Throw an error if the condition is falsy.
   */
  invariant(condition: boolean, message: string, path: string = '') {
    if (__DEV__) {
      if (condition) {
        return;
      }

      const { name } = this.currentConfig;
      let prefix = '';

      if (path) {
        if (name) {
          prefix += `Invalid \`${name}\` option "${path}". `;
        } else {
          prefix += `Invalid option "${path}". `;
        }
      } else if (name) {
        prefix += `${name}: `;
      }

      throw new Error(`${prefix}${this.errorMessage || message}`);
    }
  }

  /**
   * Set a custom error message for all checks.
   */
  message(message: string): this {
    if (__DEV__) {
      this.invariant(
        (typeof message === 'string' && !!message),
        'A non-empty string is required for custom messages.',
      );
    }

    this.errorMessage = message;

    return this;
  }

  /**
   * Allow null values.
   */
  nullable(state: boolean = true): this {
    this.isNullable = state;

    return this;
  }

  /**
   * Mark a field as only the default value can be used.
   */
  only(): this {
    if (__DEV__) {
      this.invariant(
        // eslint-disable-next-line valid-typeof
        (typeof this.defaultValue === this.type),
        `Only requires a default ${this.type} value.`,
      );
    }

    return this.addCheck(this.checkOnly);
  }

  /**
   * Disallow undefined values.
   */
  required(state: boolean = true): this {
    this.isRequired = state;

    return this;
  }

  /**
   * Run all validation checks that have been enqueued.
   */
  runChecks(path: string, initialValue: *, config: Config = {}): * {
    this.currentConfig = config;

    let value = initialValue;

    // Handle undefined
    if (typeof value === 'undefined') {
      if (!this.isRequired) {
        value = this.defaultValue;

      } else if (__DEV__) {
        this.invariant(false, 'Field is required and must be defined.', path);
      }
    }

    // Handle null
    if (value === null) {
      if (this.isNullable) {
        return value;

      } else if (__DEV__) {
        this.invariant(false, 'Null is not allowed.', path);
      }
    }

    // Run all checks against the value
    if (__DEV__) {
      this.checks.forEach((checker) => {
        checker.func.call(this, path, value, ...checker.args);
      });
    }

    return value;
  }
}
