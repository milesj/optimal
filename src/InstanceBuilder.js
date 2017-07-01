/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

export default class InstanceBuilder<T> extends Builder<?Class<T>> {
  constructor(refClass: T) {
    super('instance', null);

    invariant((typeof refClass === 'function'), 'A class reference is required.');

    this.addCheck(this.checkInstance, refClass);
  }

  checkInstance(path: string, value: *, refClass: Class<T>) {
    invariant(
      (value instanceof refClass),
      // $FlowIgnore constructor check
      `Must be an instance of "${refClass.name || refClass.constructor.name}".`,
      path,
    );
  }
}

export function instanceOf<T>(refClass: T): InstanceBuilder<T> {
  return new InstanceBuilder(refClass);
}
