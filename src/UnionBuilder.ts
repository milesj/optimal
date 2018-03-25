/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import typeOf from './typeOf';
import { SupportedType } from './types';

export default class UnionBuilder extends Builder<any> {
  builders: Builder<any>[] = [];

  constructor(builders: Builder<any>[], defaultValue: any | null = null) {
    super(SupportedType.Union, defaultValue);

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

  checkUnions(path: string, value: any, builders: Builder<any>[]) {
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

export function union(builders: Builder<any>[], defaultValue: any | null = null): UnionBuilder {
  return new UnionBuilder(builders, defaultValue);
}
