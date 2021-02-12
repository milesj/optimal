import Predicate from '../Predicate';
import { ArrayOf, DefaultValue } from '../types';
import CollectionPredicate from './Collection';

export default class ArrayPredicate<T> extends CollectionPredicate<ArrayOf<T>> {
  protected contents: Predicate<T> | null = null;

  constructor(contents: Predicate<T> | null = null, defaultValue: DefaultValue<ArrayOf<T>> = []) {
    super('array', defaultValue);

    this.contents = contents;

    if (contents instanceof Predicate) {
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
    if (value === undefined) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }

  notEmpty(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        if (this.isNullable && value === null) {
          return;
        }

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
  contents: Predicate<T> | null = null,
  defaultValue?: DefaultValue<ArrayOf<T>>,
) /* infer */ {
  return new ArrayPredicate<T>(contents, defaultValue);
}
