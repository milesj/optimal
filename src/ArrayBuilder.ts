import Builder from './Builder';
import { ArrayOf } from './types';

export default class ArrayBuilder<T> extends Builder<ArrayOf<T>> {
  contents: Builder<T> | null = null;

  constructor(contents: Builder<T> | null = null, defaultValue: ArrayOf<T> = []) {
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

  checkContents(path: string, value: ArrayOf<T>, contents: Builder<T>) {
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

export function array<T = any>(
  contents: Builder<T> | null = null,
  defaultValue?: ArrayOf<T>,
) /* infer */ {
  return new ArrayBuilder<T>(contents, defaultValue);
}
