/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class BoolBuilder extends Builder<boolean> {
  constructor(defaultValue: boolean = false) {
    super('boolean', defaultValue);

    // Only allow booleans
    this.required();
  }
}

export function bool(defaultValue: boolean): BoolBuilder {
  return new BoolBuilder(defaultValue);
}
