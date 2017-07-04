/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import invariant from './invariant';

function isNumber(value: *): boolean {
  return (typeof value === 'number');
}

export default class NumberBuilder extends Builder<number> {
  constructor(defaultValue: number = 0) {
    super('number', defaultValue);

    // Only allow numbers
    this.required();
  }

  between(min: number, max: number, inclusive: boolean = false): this {
    if (__DEV__) {
      invariant(
        (isNumber(min) && isNumber(max)),
        'number.between() requires a minimum and maximum number.',
      );
    }

    return this.addCheck(this.checkBetween, min, max, inclusive);
  }

  checkBetween(path: string, value: *, min: number, max: number, inclusive: boolean = false) {
    if (__DEV__) {
      invariant(
        (
          isNumber(value) &&
          (inclusive ? (value >= min && value <= max) : (value > min && value < max))
        ),
        `Number must be between ${min} and ${max}${inclusive ? ' inclusive' : ''}.`,
        path,
      );
    }
  }

  oneOf(list: string[] = []): this {
    if (__DEV__) {
      invariant(
        (Array.isArray(list) && list.length > 0 && list.every(isNumber)),
        'number.oneOf() requires a non-empty array of numbers.',
      );
    }

    return this.addCheck(this.checkOneOf, list);
  }

  checkOneOf(path: string, value: *, list: string[] = []) {
    if (__DEV__) {
      invariant(list.includes(value), `Number must be one of: ${list.join(', ')}`, path);
    }
  }
}

export function number(defaultValue: number = 0): NumberBuilder {
  return new NumberBuilder(defaultValue);
}
