import Predicate from '../Predicate';
import Schema from '../Schema';
import isObject from '../isObject';
import { Blueprint } from '../types';
import logUnknown from '../logUnknown';

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

  run(value: T | undefined, path: string, schema: Schema<{}>): T {
    if (__DEV__ && value) {
      this.invariant(isObject(value), 'Value passed to shape must be an object.', path);
    }

    const unknownFields: Partial<T> = { ...value };
    const struct: Partial<T> = {};

    Object.keys(this.contents).forEach(baseKey => {
      const key = baseKey as keyof T;
      const content = this.contents[key];

      struct[key] = content.run(value?.[key], `${path}.${key}`, schema)!;

      // Delete the prop and mark it as known
      delete unknownFields[key];
    });

    // Handle unknown options
    if (this.isExact) {
      if (__DEV__) {
        logUnknown(unknownFields, path);
      }
    } else {
      Object.assign(struct, unknownFields);
    }

    return struct as T;
  }
}

export function shape<T extends object>(contents: Blueprint<T>) /* infer */ {
  return new ShapePredicate<T>(contents);
}
