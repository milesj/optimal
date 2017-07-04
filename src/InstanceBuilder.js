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
        // $FlowIgnore constructor check
        `Must be an instance of "${refClass.name || refClass.constructor.name}".`,
        path,
      );
    }
  }
}

export function instanceOf<T>(refClass: T): InstanceBuilder<T> {
  return new InstanceBuilder(refClass);
}

export function regex(): InstanceBuilder<Class<RegExp>> {
  return instanceOf(RegExp);
}

export function date(): InstanceBuilder<Class<Date>> {
  return instanceOf(Date);
}
