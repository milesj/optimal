/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

export default class ArrayBuilder<T> extends Builder<T[]> {
  constructor(contents: Builder<T>) {
    super('array', []);

    invariant((contents instanceof Builder), 'A blueprint is required for array contents.');

    this.addCheck(this.checkContents, contents);
  }

  checkContents(path: string, array: *, contents: Builder<T>) {
    array.forEach((value) => {
      contents.runChecks(path, value);
    });
  }
}

export function arrayOf<T>(contents: Builder<T>): ArrayBuilder<T> {
  return new ArrayBuilder(contents);
}
