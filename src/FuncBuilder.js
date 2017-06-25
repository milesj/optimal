/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable flowtype/no-weak-types */

import Builder from './Builder';

export default class FuncBuilder extends Builder<?Function> {
  constructor(defaultValue: ?Function = null) {
    super('function', defaultValue);
  }
}

export function func(defaultValue: ?Function = null): FuncBuilder {
  return new FuncBuilder(defaultValue);
}
