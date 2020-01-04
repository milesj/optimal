import Builder from './Builder';
import CollectionBuilder from './CollectionBuilder';
import { ArrayOf, DefaultValue } from './types';

export default class ArrayBuilder<T> extends CollectionBuilder<ArrayOf<T>> {
  protected contents: Builder<T> | null = null;

  constructor(contents: Builder<T> | null = null, defaultValue: DefaultValue<ArrayOf<T>> = []) {
    super('array', defaultValue);

    this.contents = contents;

    if (contents instanceof Builder) {
      this.addCheck((path, value) => {
        const nextValue = [...value];

        value.forEach((item: T, i: number) => {
          nextValue[i] = contents.run(item, `${path}[${i}]`, this.schema!)!;
        });

        return nextValue;
      });
    } else if (__DEV__ && contents) {
      this.invariant(false, 'A blueprint is required for array contents.');
    }
  }

  cast(value: unknown): ArrayOf<T> {
    return Array.isArray(value) ? value : [value];
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
