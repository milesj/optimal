/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

import type { Checker } from './types';

export default class CustomBuilder extends Builder<*> {
  constructor(callback: Checker, defaultValue?: * = null) {
    super('custom', defaultValue);

    if (__DEV__) {
      this.invariant(
        (typeof callback === 'function'),
        'Custom blueprints require a validation function.',
      );
    }

    this.addCheck(this.checkCallback, callback);
  }

  checkCallback(path: string, value: *, callback: Checker) {
    callback.call(this, path, value);
  }
}

export function custom(checker: Checker, defaultValue?: * = null): CustomBuilder {
  return new CustomBuilder(checker, defaultValue);
}
