import optimal from './optimal';
import Builder from './Builder';
import Schema from './Schema';
import isObject from './isObject';
import { Blueprint } from './types';

export default class ShapeBuilder<T extends object> extends Builder<T> {
  protected contents: Blueprint<T>;

  protected isExact: boolean = false;

  constructor(contents: Blueprint<T>) {
    super('shape', {} as T);

    if (__DEV__) {
      this.invariant(
        isObject(contents) &&
          Object.keys(contents).length > 0 &&
          Object.keys(contents).every(
            key => contents[key as keyof typeof contents] instanceof Builder,
          ),
        'A non-empty object of properties to blueprints are required for a shape.',
      );
    }

    this.contents = contents;
  }

  exact(): this {
    this.isExact = true;

    return this;
  }

  run(value: T | undefined, path: string, schema: Schema<{}>) {
    const object = value || this.getDefaultValue() || {};

    if (__DEV__) {
      this.invariant(isObject(object), 'Value passed to shape must be an object.', path);
    }

    return optimal(object, this.contents, {
      file: schema.filePath,
      name: schema.schemaName,
      prefix: path,
      unknown: !this.isExact,
    });
  }
}

export function shape<T extends object>(contents: Blueprint<T>) /* infer */ {
  return new ShapeBuilder<T>(contents);
}
