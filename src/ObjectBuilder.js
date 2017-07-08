/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class ObjectBuilder<T> extends Builder<?{ [key: string]: T }> {
  constructor(contents?: Builder<T>, defaultValue: ?{ [key: string]: T } = {}) {
    super('object', defaultValue);

    if (contents) {
      if (contents instanceof Builder) {
        this.addCheck(this.checkContents, contents);

      } else if (__DEV__) {
        this.invariant(false, 'A blueprint is required for object contents.');
      }
    }
  }

  checkContents(path: string, value: *, contents: Builder<T>) {
    if (__DEV__) {
      Object.keys(value).forEach((key) => {
        contents.runChecks(
          `${path}.${key}`,
          value[key],
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
        (Object.keys(value).length > 0),
        'Object cannot be empty.',
        path,
      );
    }
  }
}

export function object<T>(
  contents?: Builder<T>,
  defaultValue: ?{ [key: string]: T } = {},
): ObjectBuilder<T> {
  return new ObjectBuilder(contents, defaultValue);
}
