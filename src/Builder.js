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
  currentOptions: Object = {};
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

    this.addCheck(this.checkType);
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
   * Map a list of option names that must be defined alongside this field.
   */
  and(...keys: string[]): this {
    if (__DEV__) {
      this.invariant(
        (keys.length > 0),
        'AND requires a list of option names.',
      );
    }

    return this.addCheck(this.checkAnd, keys);
  }

  /**
   * Validate that all options have been defined.
   */
  checkAnd(path: string, value: *, keys: string[]) {
    if (__DEV__) {
      keys.unshift(this.key(path));

      const options = this.currentOptions;
      const undefs = keys.filter(key => (
        typeof options[key] === 'undefined' || options[key] === null
      ));

      this.invariant(
        (undefs.length === 0),
        `All of these options must be defined: ${keys.join(', ')}`,
        path,
      );
    }
  }

  /**
   * Validate the type of value.
   */
  checkType(path: string, value: *) {
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
          prefix += `Invalid ${name} option "${path}". `;
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
   * Return the current key from a path.
   */
  key(path: string): string {
    const index = path.lastIndexOf('.');

    return (index > 0) ? path.slice(index + 1) : path;
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
   * Map a list of option names that must have at least 1 defined.
   */
  or(...keys: string[]): this {
    if (__DEV__) {
      this.invariant(
        (keys.length > 0),
        'OR requires a list of option names.',
      );
    }

    return this.addCheck(this.checkOr, keys);
  }

  /**
   * Validate that at least 1 option is defined.
   */
  checkOr(path: string, value: *, keys: string[]) {
    if (__DEV__) {
      keys.unshift(this.key(path));

      const options = this.currentOptions;
      const defs = keys.filter(key => (
        typeof options[key] !== 'undefined' && options[key] !== null
      ));

      this.invariant(
        (defs.length > 0),
        `At least one of these options must be defined: ${keys.join(', ')}`,
        path,
      );
    }
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
  runChecks(path: string, initialValue: *, options: Object, config: Config = {}): * {
    this.currentConfig = config;
    this.currentOptions = options;

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

  /**
   * Map a list of option names that must not be defined alongside this field.
   */
  xor(...keys: string[]): this {
    if (__DEV__) {
      this.invariant(
        (keys.length > 0),
        'XOR requires a list of option names.',
      );
    }

    return this.addCheck(this.checkXor, keys);
  }

  /**
   * Validate that only 1 option is defined.
   */
  checkXor(path: string, value: *, keys: string[]) {
    if (__DEV__) {
      keys.unshift(this.key(path));

      const options = this.currentOptions;
      const defs = keys.filter(key => (
        typeof options[key] !== 'undefined' && options[key] !== null
      ));

      this.invariant(
        (defs.length <= 1),
        `Only one of these options may be defined: ${keys.join(', ')}`,
        path,
      );
    }
  }
}
