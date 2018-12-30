/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import isObject from './isObject';
import { SupportedType } from './types';

// Not supported: Shape, Custom
export default function typeOf(value: any): SupportedType {
  if (Array.isArray(value)) {
    return value.every(item => typeof item === typeof value[0]) ? 'array' : 'union';
  }

  if (isObject(value)) {
    return value.constructor === Object ? 'object' : 'instance';
  }

  switch (typeof value) {
    case 'boolean':
    case 'function':
    case 'number':
    case 'string':
      // @ts-ignore
      return typeof value;
    default:
      return 'unknown';
  }
}
