import CollectionPredicate from './Collection';
import { predicate } from './Instance';
import Predicate from '../Predicate';
import { ObjectOf, DefaultValue } from '../types';
import isObject from '../isObject';

export default class ObjectPredicate<T, K extends string = string> extends CollectionPredicate<
  ObjectOf<T, K>
> {
  protected contents: Predicate<T> | null = null;

  constructor(contents: Predicate<T> | null = null, defaultValue?: DefaultValue<ObjectOf<T, K>>) {
    super('object', defaultValue || (({} as unknown) as ObjectOf<T, K>));

    this.contents = contents;

    if (contents instanceof Predicate) {
      this.addCheck((path, value) => {
        const nextValue = { ...value };

        Object.keys(value).forEach(baseKey => {
          const key = baseKey as keyof typeof value;

          nextValue[key] = contents.run(value[key], `${path}.${key}`, this.schema!)!;
        });

        return nextValue;
      });
    } else if (__DEV__ && contents) {
      this.invariant(false, 'A blueprint is required for object contents.');
    }
  }

  cast(value: unknown): ObjectOf<T, K> {
    const obj = isObject(value) ? value : {};

    return (obj as unknown) as ObjectOf<T, K>;
  }

  notEmpty(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(Object.keys(value).length > 0, 'Object cannot be empty.', path);
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

export function object<T = unknown, K extends string = string>(
  contents: Predicate<T> | null = null,
  defaultValue?: DefaultValue<ObjectOf<T, K>>,
) /* infer */ {
  return new ObjectPredicate<T, K>(contents, defaultValue);
}

export function blueprint<T = unknown, K extends string = string>(
  defaultValue?: DefaultValue<ObjectOf<Predicate<T>, K>>,
) /* infer */ {
  return new ObjectPredicate<Predicate<T>, K>(predicate<T>().notNullable(), defaultValue);
}
