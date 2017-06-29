/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';

export default class RegexBuilder extends Builder<?RegExp> {
  constructor(defaultValue: ?RegExp = null) {
    super('regex', defaultValue);
  }
}

export function regex(defaultValue: ?RegExp = null): RegexBuilder {
  return new RegexBuilder(defaultValue);
}
