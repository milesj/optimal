/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import isObject from './isObject';

// eslint-disable-next-line flowtype/no-weak-types
export default class InstanceBuilder<T: Function> extends Builder<?T> {
  refClass: ?T;

  constructor(refClass?: ?T = null) {
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

  checkInstance(path: string, value: *, refClass: ?T) {
    if (__DEV__) {
      if (refClass) {
        this.invariant(
          value instanceof refClass,
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

    return refClass ? refClass.name || refClass.constructor.name : 'Class';
  }
}

// eslint-disable-next-line flowtype/no-weak-types
export function instance<T: Function>(refClass?: ?T = null): InstanceBuilder<T> {
  return new InstanceBuilder(refClass);
}

export function regex(): InstanceBuilder<Class<RegExp>> {
  return instance(RegExp);
}

export function date(): InstanceBuilder<Class<Date>> {
  return instance(Date);
}
