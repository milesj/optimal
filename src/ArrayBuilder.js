/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class ArrayBuilder<T> extends Builder<?T[]> {
  constructor(contents: Builder<T>, defaultValue: ?T[] = []) {
    super('array', defaultValue);

    if (__DEV__) {
      this.invariant(
        (contents instanceof Builder),
        'A blueprint is required for array contents.',
      );
    }

    this.addCheck(this.checkContents, contents);
  }

  checkContents(path: string, value: *, contents: Builder<T>) {
    if (__DEV__) {
      value.forEach((item, i) => {
        contents.runChecks(
          `${path}[${i}]`,
          item,
          this.currentOptions,
          this.currentConfig,
        );
      });
    }
  }

  notEmpty(): this {
    return this.addCheck(this.checkNotEmpty);
  }

  checkNotEmpty(path: string, value: *) {
    if (__DEV__) {
      this.invariant(
        (value.length > 0),
        'Array cannot be empty.',
        path,
      );
    }
  }
}

export function array<T>(contents: Builder<T>, defaultValue: ?T[] = []): ArrayBuilder<T> {
  return new ArrayBuilder(contents, defaultValue);
}
