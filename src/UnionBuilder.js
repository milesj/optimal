/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';
import typeOf from './typeOf';

export default class UnionBuilder extends Builder<Builder<*>[]> {
  constructor(builders: Builder<*>[]) {
    super('union', []);

    invariant((
      Array.isArray(builders) &&
      builders.length > 0 &&
      builders.every(builder => (builder instanceof Builder))
    ), 'An array of blueprints are required for a union.');

    this.addCheck(this.checkUnions, builders);
  }

  checkUnions(path: string, value: *, builders: Builder<*>[]) {
    const supportedTypes = [];
    const type = typeOf(value);
    let checked = false;

    builders.forEach((builder) => {
      invariant((builder.type !== 'union'), 'Nested unions are not supported.');

      if (type === builder.type) {
        builder.runChecks(path, value);
        checked = true;
      }

      supportedTypes.push(builder.type);
    });

    invariant(checked, `Type must be one of ${supportedTypes.join(', ')}.`, path);
  }
}

export function union(builders: Builder<*>[]): UnionBuilder {
  return new UnionBuilder(builders);
}
