/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

export default class BoolBuilder extends Builder<boolean> {
  constructor(defaultValue: boolean) {
    super('boolean', defaultValue);

    // Only allow booleans
    this.required();
  }

  only(): this {
    invariant(
      (typeof this.defaultValue === 'boolean'),
      'bool.only() requires a default boolean value.',
    );

    return this.addCheck(this.checkOnly);
  }

  checkOnly(path: string, value: *) {
    const only = this.defaultValue;

    invariant((value === only), `Boolean may only be ${String(only)}.`, path);
  }
}

export function bool(defaultValue: boolean): BoolBuilder {
  return new BoolBuilder(defaultValue);
}
