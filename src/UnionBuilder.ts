/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import typeOf from './typeOf';

export default class UnionBuilder<Struct extends object> extends Builder<any, Struct> {
  builders: Builder<any, Struct>[] = [];

  constructor(builders: Builder<any, Struct>[], defaultValue: any = null) {
    super('union', defaultValue);

    if (process.env.NODE_ENV !== 'production') {
      this.invariant(
        Array.isArray(builders) &&
          builders.length > 0 &&
          builders.every(builder => builder instanceof Builder),
        'A non-empty array of blueprints are required for a union.',
      );

      this.builders = builders;
      this.addCheck(this.checkUnions, builders);
    }
  }

  checkUnions(path: string, value: any, builders: Builder<any, Struct>[]) {
    if (process.env.NODE_ENV !== 'production') {
      const usage: { [type: string]: boolean } = {};
      const keys: string[] = [];
      const type = typeOf(value);

      // Verify structure and usage
      builders.forEach(builder => {
        if (usage[builder.type]) {
          this.invariant(false, `Multiple instances of "${builder.type}" are not supported.`, path);
        } else if (builder.type === 'union') {
          this.invariant(false, 'Nested unions are not supported.', path);
        } else {
          usage[builder.type] = true;
          keys.push(builder.typeAlias());
        }
      });

      if (usage.shape && usage.object) {
        this.invariant(false, 'Objects and shapes within the same union are not supported.', path);
      }

      // Run checks on value
      let checked = false;

      builders.forEach(builder => {
        if (
          type === builder.type ||
          (type === 'object' && builder.type === 'shape') ||
          builder.type === 'custom'
        ) {
          checked = true;
          builder.runChecks(path, value, this.currentStruct, this.options);
        }
      });

      this.invariant(checked, `Type must be one of: ${keys.join(', ')}`, path);
    }
  }

  /**
   * Return the type name using generics syntax.
   */
  typeAlias(): string {
    return this.builders.map(builder => builder.typeAlias()).join(' | ');
  }
}

export function union<S extends object>(
  builders: Builder<any, S>[],
  defaultValue: any | null = null,
): UnionBuilder<S> {
  return new UnionBuilder(builders, defaultValue);
}
