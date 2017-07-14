/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export type CustomChecker = (value: *, options: Object) => void;

export default class CustomBuilder extends Builder<*> {
  constructor(callback: CustomChecker, defaultValue?: * = null) {
    super('custom', defaultValue);

    if (__DEV__) {
      this.invariant(
        (typeof callback === 'function'),
        'Custom blueprints require a validation function.',
      );
    }

    this.addCheck(this.checkCallback, callback);
  }

  checkCallback(path: string, value: *, callback: CustomChecker) {
    if (__DEV__) {
      try {
        callback(value, this.currentOptions);
      } catch (error) {
        this.invariant(false, error.message, path);
      }
    }
  }
}

export function custom(checker: CustomChecker, defaultValue?: * = null): CustomBuilder {
  return new CustomBuilder(checker, defaultValue);
}
