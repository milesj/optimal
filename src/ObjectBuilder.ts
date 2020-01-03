import Builder from './Builder';
import CollectionBuilder from './CollectionBuilder';
import { ObjectOf, DefaultValue } from './types';
import { builder } from './InstanceBuilder';
import isObject from './isObject';

export default class ObjectBuilder<T> extends CollectionBuilder<ObjectOf<T>> {
  protected contents: Builder<T> | null = null;

  constructor(contents: Builder<T> | null = null, defaultValue: DefaultValue<ObjectOf<T>> = {}) {
    super('object', defaultValue);

    this.contents = contents;

    if (contents instanceof Builder) {
      this.addCheck((path, value) => {
        const nextValue = { ...value };

        Object.keys(value).forEach(key => {
          nextValue[key] = contents.run(
            value[key],
            `${path}.${key}`,
            this.currentStruct,
            this.options,
          )!;
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
  contents: Builder<T> | null = null,
  defaultValue?: DefaultValue<ObjectOf<T>>,
) /* infer */ {
  return new ObjectBuilder<T>(contents, defaultValue);
}

export function blueprint<T = unknown>(
  defaultValue?: DefaultValue<ObjectOf<Builder<T>>>,
) /* infer */ {
  return new ObjectBuilder<Builder<T>>(builder<T>().notNullable(), defaultValue);
}
