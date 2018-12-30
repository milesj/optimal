/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';
import { Blueprint, Struct, OptimalOptions } from './types';

export interface Shape {
  [key: string]: any;
}

export default class ShapeBuilder extends Builder<Shape | null> {
  contents: Blueprint;

  constructor(contents: Blueprint, defaultValue: Shape | null = {}) {
    super('shape', defaultValue);

    if (__DEV__) {
      this.invariant(
        isObject(contents) &&
          Object.keys(contents).length > 0 &&
          Object.keys(contents).every(key => contents[key] instanceof Builder),
        'A non-empty object of properties to blueprints are required for a shape.',
      );
    }

    this.contents = contents;
  }

  runChecks(path: string, initialValue: any, struct: Struct, options: OptimalOptions = {}): any {
    const value: any = {};
    const object = initialValue || this.defaultValue || {};

    if (__DEV__) {
      this.invariant(
        typeof object === 'object' && object,
        'Value passed to shape must be an object.',
        path,
      );
    }

    Object.keys(this.contents).forEach(key => {
      const builder = this.contents[key];

      if (builder instanceof Builder) {
        value[key] = builder.runChecks(`${path}.${key}`, object[key], object, options);
      } else {
        value[key] = object[key];
      }
    });

    return value;
  }
}

export function shape(contents: Blueprint, defaultValue: Shape | null = {}): ShapeBuilder {
  return new ShapeBuilder(contents, defaultValue);
}
