/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';

export default class InstanceBuilder<T> extends Builder<T | null> {
  refClass: T | null = null;

  constructor(refClass: T | null = null) {
    super('instance', null);

    // Nullable by default
    this.nullable();

    if (process.env.NODE_ENV !== 'production') {
      if (refClass) {
        this.invariant(typeof refClass === 'function', 'A class reference is required.');
      }

      this.refClass = refClass;
      this.addCheck(this.checkInstance, refClass);
    }
  }

  checkInstance(path: string, value: any, refClass: T | null) {
    if (process.env.NODE_ENV !== 'production') {
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

    // @ts-ignore
    return refClass ? refClass.name || refClass.constructor.name : 'class';
  }
}

export function instance<T extends Function>(refClass: T | null = null): InstanceBuilder<T> {
  return new InstanceBuilder(refClass);
}

export function regex(): InstanceBuilder<Function> {
  return instance(RegExp);
}

export function date(): InstanceBuilder<Function> {
  return instance(Date);
}
