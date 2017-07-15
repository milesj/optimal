/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */
/* eslint-disable flowtype/no-weak-types */

import Builder from './Builder';

export default class InstanceBuilder<T: Function> extends Builder<?T> {
  refClass: T;

  constructor(refClass: T) {
    super('instance', null);

    // Nullable by default
    this.nullable();

    if (__DEV__) {
      this.invariant(
        (typeof refClass === 'function'),
        'A class reference is required.',
      );
    }

    this.refClass = refClass;
    this.addCheck(this.checkInstance, refClass);
  }

  checkInstance(path: string, value: *, refClass: T) {
    if (__DEV__) {
      this.invariant(
        (value instanceof refClass),
        `Must be an instance of "${this.typeAlias()}".`,
        path,
      );
    }
  }

  /**
   * If reference class is defined, return the class name if available.
   */
  typeAlias(): string {
    const { refClass } = this;

    return refClass ? (refClass.name || refClass.constructor.name) : 'Class';
  }
}

export function instance<T>(refClass: T): InstanceBuilder<T> {
  return new InstanceBuilder(refClass);
}

export function regex(): InstanceBuilder<Class<RegExp>> {
  return instance(RegExp);
}

export function date(): InstanceBuilder<Class<Date>> {
  return instance(Date);
}
