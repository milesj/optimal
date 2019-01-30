/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';

export type Constructor<T> = new (...args: any[]) => T;

export default class InstanceBuilder<Struct extends object, T> extends Builder<Struct, T | null> {
  refClass: Constructor<T> | null = null;

  constructor(refClass: Constructor<T> | null = null) {
    super('instance', null);

    // Nullable by default
    this.nullable();

    if (__DEV__) {
      if (refClass) {
        this.invariant(typeof refClass === 'function', 'A class reference is required.');
      }

      this.refClass = refClass;
      this.addCheck(this.checkInstance, refClass);
    }
  }

  checkInstance(path: string, value: T, refClass: T | null) {
    if (__DEV__) {
      if (refClass) {
        this.invariant(
          typeof refClass === 'function' && value instanceof refClass,
          `Must be an instance of "${this.typeAlias()}".`,
          path,
        );
      } else {
        this.invariant(
          isObject(value) && value.constructor !== Object,
          'Must be a class instance.',
          path,
        );
      }
    }
  }

  /**
   * If reference class is defined, return the class name if available.
   */
  typeAlias(): string {
    const { refClass } = this;

    return refClass ? refClass.name || refClass.constructor.name : 'class';
  }
}

export function instance<S extends object, T = Function>(
  refClass: Constructor<T> | null = null,
) /* infer */ {
  return new InstanceBuilder<S, T>(refClass);
}

export function regex<S extends object>() /* infer */ {
  return instance<S, RegExp>(RegExp);
}

export function date<S extends object>() /* infer */ {
  return instance<S, Date>(Date);
}
