import CollectionPredicate from './Collection';
import { predicate } from './Instance';
import Predicate from '../Predicate';
import { ObjectOf, DefaultValue } from '../types';
import isObject from '../isObject';

export default class ObjectPredicate<T> extends CollectionPredicate<ObjectOf<T>> {
  protected contents: Predicate<T> | null = null;

  constructor(contents: Predicate<T> | null = null, defaultValue: DefaultValue<ObjectOf<T>> = {}) {
    super('object', defaultValue);

    this.contents = contents;

    if (contents instanceof Predicate) {
      this.addCheck((path, value) => {
        const nextValue = { ...value };

        Object.keys(value).forEach(key => {
          nextValue[key] = contents.run(value[key], `${path}.${key}`, this.schema!)!;
        });

        return nextValue;
      });
    } else if (__DEV__ && contents) {
      this.invariant(false, 'A blueprint is required for object contents.');
    }
  }

  cast(value: unknown): ObjectOf<T> {
    const obj = isObject(value) ? value : {};

    return (obj as unknown) as ObjectOf<T>;
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

export function object<T = unknown>(
  contents: Predicate<T> | null = null,
  defaultValue?: DefaultValue<ObjectOf<T>>,
) /* infer */ {
  return new ObjectPredicate<T>(contents, defaultValue);
}

export function blueprint<T = unknown>(
  defaultValue?: DefaultValue<ObjectOf<Predicate<T>>>,
) /* infer */ {
  return new ObjectPredicate<Predicate<T>>(predicate<T>().notNullable(), defaultValue);
}
