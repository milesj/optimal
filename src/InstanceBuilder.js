/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class InstanceBuilder<T> extends Builder<?T> {
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
        `Must be an instance of "${this.typeName()}".`,
        path,
      );
    }
  }

  /**
   * Return the class name if available.
   */
  typeName(): string {
    const { refClass } = this;

    // $FlowIgnore constructor check
    return refClass ? (refClass.name || refClass.constructor.name) : this.type;
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
