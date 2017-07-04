/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class ObjectBuilder<T> extends Builder<?{ [key: string]: T }> {
  constructor(contents: Builder<T>, defaultValue: ?{ [key: string]: T } = {}) {
    super('object', defaultValue);

    if (__DEV__) {
      this.invariant(
        (contents instanceof Builder),
        'A blueprint is required for object contents.',
      );
    }

    this.addCheck(this.checkContents, contents);
  }

  checkContents(path: string, object: *, contents: Builder<T>) {
    if (__DEV__) {
      Object.keys(object).forEach((key) => {
        contents.runChecks(`${path}.${key}`, object[key]);
      });
    }
  }

  notEmpty(): this {
    return this.addCheck(this.checkNotEmpty);
  }

  checkNotEmpty(path: string, object: *) {
    if (__DEV__) {
      this.invariant(
        (Object.keys(object).length > 0),
        'Object cannot be empty.',
        path,
      );
    }
  }
}

export function objectOf<T>(
  contents: Builder<T>,
  defaultValue: ?{ [key: string]: T } = {},
): ObjectBuilder<T> {
  return new ObjectBuilder(contents, defaultValue);
}
