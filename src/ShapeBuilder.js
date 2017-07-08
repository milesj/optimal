/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import isObject from './isObject';

type ShapeBlueprint = { [key: string]: Builder<*> };
type Shape = { [key: string]: * };

export default class ShapeBuilder extends Builder<?Shape> {
  constructor(contents: ShapeBlueprint, defaultValue: ?Shape = {}) {
    super('shape', defaultValue);

    if (__DEV__) {
      this.invariant(
        (
          isObject(contents) &&
          Object.keys(contents).length > 0 &&
          Object.keys(contents).every(key => (contents[key] instanceof Builder))
        ),
        'A non-empty object of properties to blueprints are required for a shape.',
      );
    }

    this.addCheck(this.checkContents, contents);
  }

  checkContents(path: string, object: *, contents: ShapeBlueprint) {
    if (__DEV__) {
      Object.keys(contents).forEach((key) => {
        const builder = contents[key];

        // Properties should be optional by default unless explicitly required
        if (builder.isRequired || typeof object[key] !== 'undefined') {
          builder.runChecks(
            `${path}.${key}`,
            object[key],
            object,
            this.currentConfig,
          );
        }
      });
    }
  }
}

export function shape(contents: ShapeBlueprint, defaultValue: ?Shape = {}): ShapeBuilder {
  return new ShapeBuilder(contents, defaultValue);
}
