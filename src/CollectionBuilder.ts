/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

export default class CollectionBuilder<T, D, Struct extends object> extends Builder<
  D | null,
  Struct
> {
  contents: Builder<T, Struct> | null = null;

  constructor(
    type: 'array' | 'object',
    contents: Builder<T, Struct> | null = null,
    defaultValue: D | null = null,
  ) {
    super(type, defaultValue);

    if (process.env.NODE_ENV !== 'production') {
      if (contents) {
        if (contents instanceof Builder) {
          this.contents = contents;
          this.addCheck(this.checkContents, contents);
        } else {
          this.invariant(false, `A blueprint is required for ${type} contents.`);
        }
      }
    }
  }

  checkContents(path: string, value: any, contents: Builder<T, Struct>) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.type === 'array') {
        value.forEach((item: T, i: number) => {
          contents.runChecks(`${path}[${i}]`, item, this.currentStruct, this.options);
        });
      } else if (this.type === 'object') {
        Object.keys(value).forEach(key => {
          contents.runChecks(`${path}.${key}`, value[key], this.currentStruct, this.options);
        });
      }
    }
  }

  notEmpty(): this {
    return this.addCheck(this.checkNotEmpty);
  }

  checkNotEmpty(path: string, value: any) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.type === 'array') {
        this.invariant(value.length > 0, 'Array cannot be empty.', path);
      } else if (this.type === 'object') {
        this.invariant(Object.keys(value).length > 0, 'Object cannot be empty.', path);
      }
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
  defaultValue: T[] | null = [],
): CollectionBuilder<T, T[], S> {
  return new CollectionBuilder('array', contents, defaultValue);
}

export function object<T, S extends object>(
  contents: Builder<T, S> | null = null,
  defaultValue: { [key: string]: T } | null = {},
): CollectionBuilder<T, { [key: string]: T }, S> {
  return new CollectionBuilder('object', contents, defaultValue);
}
