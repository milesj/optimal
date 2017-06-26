/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

export default class ArrayBuilder<T> extends Builder<T[]> {
  contents: Builder<T>;

  constructor(contents: Builder<T>) {
    super('array', []);

    invariant((contents instanceof Builder), 'A blueprint is required for array contents.');

    this.contents = contents;
    this.addCheck(this.checkContents);
  }

  checkContents(path: string, array: *) {
    array.forEach((value) => {
      this.contents.runChecks(path, value);
    });
  }
}

export function arrayOf<T>(contents: Builder<T>): ArrayBuilder<T> {
  return new ArrayBuilder(contents);
}
