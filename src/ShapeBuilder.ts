/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';
import { Blueprint, SupportedType } from './types';

export interface Shape {
  [key: string]: any;
}

export default class ShapeBuilder extends Builder<Shape | null> {
  constructor(contents: Blueprint, defaultValue: Shape | null = {}) {
    super(SupportedType.Shape, defaultValue);

    if (process.env.NODE_ENV !== 'production') {
      this.invariant(
        isObject(contents) &&
          Object.keys(contents).length > 0 &&
          Object.keys(contents).every(key => contents[key] instanceof Builder),
        'A non-empty object of properties to blueprints are required for a shape.',
      );

      this.addCheck(this.checkContents, contents);
    }
  }

  checkContents(path: string, object: any, contents: Blueprint) {
    if (process.env.NODE_ENV !== 'production') {
      Object.keys(contents).forEach(key => {
        const builder = contents[key];

        // Fields should be optional by default unless explicitly required
        if (
          builder instanceof Builder &&
          (builder.isRequired || typeof object[key] !== 'undefined')
        ) {
          builder.runChecks(`${path}.${key}`, object[key], object, this.options);
        }
      });
    }
  }
}

export function shape(contents: Blueprint, defaultValue: Shape | null = {}): ShapeBuilder {
  return new ShapeBuilder(contents, defaultValue);
}
