/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

export type ArrayOf<T> = T[];

export default class ArrayBuilder<T, Struct extends object> extends Builder<
  ArrayOf<T> | null,
  Struct
> {
  contents: Builder<T, Struct> | null = null;

  constructor(contents: Builder<T, Struct> | null = null, defaultValue: ArrayOf<T> | null = []) {
    super('array', defaultValue);

    if (__DEV__) {
      if (contents) {
        if (contents instanceof Builder) {
          this.contents = contents;
          this.addCheck(this.checkContents, contents);
        } else {
          this.invariant(false, 'A blueprint is required for array contents.');
        }
      }
    }
  }

  checkContents(path: string, value: ArrayOf<T>, contents: Builder<T, Struct>) {
    if (__DEV__) {
      value.forEach((item: T, i: number) => {
        contents.runChecks(`${path}[${i}]`, item, this.currentStruct, this.options);
      });
    }
  }

  notEmpty(): this {
    return this.addCheck(this.checkNotEmpty);
  }

  checkNotEmpty(path: string, value: ArrayOf<T>) {
    if (__DEV__) {
      this.invariant(value.length > 0, 'Array cannot be empty.', path);
    }
  }

  /**
   * If contents are defined, return the type name using generics syntax.
   */
  typeAlias(): string {
    const { contents } = this;
    const alias = super.typeAlias();

    return contents ? `${alias}<${contents.typeAlias()}>` : alias;
  }
}

export function array<T, S extends object>(
  contents: Builder<T, S> | null = null,
  defaultValue?: ArrayOf<T> | null,
) /* infer */ {
  return new ArrayBuilder<T, S>(contents, defaultValue);
}
