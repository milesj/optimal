import optimal from '../optimal';
import Predicate from '../Predicate';
import Schema from '../Schema';
import isObject from '../isObject';
import { Blueprint } from '../types';

export default class ShapePredicate<T extends object> extends Predicate<T> {
  protected contents: Blueprint<T>;

  protected isExact: boolean = false;

  constructor(contents: Blueprint<T>) {
    super('shape', {} as T);

    if (__DEV__) {
      this.invariant(
        isObject(contents) &&
          Object.keys(contents).length > 0 &&
          Object.values(contents).every(content => content instanceof Predicate),
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
  return new ShapePredicate<T>(contents);
}
