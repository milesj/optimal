/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import isObject from './isObject';
import { SupportedType } from './types';

export default function typeOf(value: any): SupportedType {
  if (Array.isArray(value)) {
    return 'array';
  } else if (isObject(value)) {
    return value.constructor === Object ? 'object' : 'instance';
  }

  // @ts-ignore
  return typeof value;
}
