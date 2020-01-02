import Builder from './Builder';
import CollectionBuilder from './CollectionBuilder';
import { ArrayOf, DefaultValue } from './types';

export default class ArrayBuilder<T> extends CollectionBuilder<ArrayOf<T>> {
  protected contents: Builder<T> | null = null;

  constructor(contents: Builder<T> | null = null, defaultValue: DefaultValue<ArrayOf<T>> = []) {
    super('array', defaultValue);

    if (__DEV__ && contents) {
      if (contents instanceof Builder) {
        this.contents = contents;
        this.addCheck((path, value) => {
          const nextValue = [...value];

          if (__DEV__) {
            value.forEach((item: T, i: number) => {
              nextValue[i] = contents.runChecks(
                `${path}[${i}]`,
                item,
                this.currentStruct,
                this.options,
              )!;
            });
          }

          return nextValue;
        });
      } else {
        this.invariant(false, 'A blueprint is required for array contents.');
      }
    }
  }

  notEmpty(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value.length > 0, 'Array cannot be empty.', path);
      });
    }

    return this;
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

export function array<T = unknown>(
  contents: Builder<T> | null = null,
  defaultValue?: DefaultValue<ArrayOf<T>>,
) /* infer */ {
  return new ArrayBuilder<T>(contents, defaultValue);
}
