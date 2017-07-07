/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class BoolBuilder extends Builder<boolean> {
  constructor(defaultValue: boolean = false) {
    super('boolean', defaultValue);
  }
}

export function bool(defaultValue: boolean = false): BoolBuilder {
  return new BoolBuilder(defaultValue);
}
