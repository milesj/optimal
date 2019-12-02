import Builder from './Builder';
import isObject from './isObject';
import optimal from './optimal';
import { Blueprint, OptimalOptions } from './types';

export default class ShapeBuilder<Shape extends object> extends Builder<Shape> {
  contents: Blueprint<Shape>;

  isExact: boolean = false;

  constructor(contents: Blueprint<Shape>) {
    // @ts-ignore
    super('shape', {});

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

  runChecks(
    path: string,
    initialValue: Shape | undefined,
    struct: object,
    options: OptimalOptions = {},
  ) {
    const object = initialValue || this.defaultValue || {};

    if (__DEV__) {
      this.invariant(isObject(object), 'Value passed to shape must be an object.', path);
    }

    return optimal(object, this.contents, {
      ...options,
      prefix: path,
      unknown: !this.isExact,
    });
  }
}

export function shape<P extends object>(contents: Blueprint<P>) /* infer */ {
  return new ShapeBuilder<P>(contents);
}
