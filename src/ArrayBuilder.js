/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

export default class ArrayBuilder<T> extends Builder<?T[]> {
  constructor(contents: Builder<T>, defaultValue: ?T[] = []) {
    super('array', defaultValue);

    if (__DEV__) {
      invariant((contents instanceof Builder), 'A blueprint is required for array contents.');
    }

    this.addCheck(this.checkContents, contents);
  }

  checkContents(path: string, array: *, contents: Builder<T>) {
    if (__DEV__) {
      array.forEach((value, i) => {
        contents.runChecks(`${path}[${i}]`, value);
      });
    }
  }
}

export function arrayOf<T>(contents: Builder<T>, defaultValue: ?T[] = []): ArrayBuilder<T> {
  return new ArrayBuilder(contents, defaultValue);
}
