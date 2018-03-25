/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import isObject from './isObject';
import { SupportedType } from './types';

// Not supported: Shape, Custom
export default function typeOf(value: any): SupportedType {
  if (Array.isArray(value)) {
    return value.every(item => typeof item === typeof value[0])
      ? SupportedType.Array
      : SupportedType.Union;
  }

  if (isObject(value)) {
    return value.constructor === Object ? SupportedType.Object : SupportedType.Instance;
  }

  switch (typeof value) {
    case 'boolean':
      return SupportedType.Boolean;
    case 'function':
      return SupportedType.Function;
    case 'number':
      return SupportedType.Number;
    case 'string':
      return SupportedType.String;
    default:
      return SupportedType.Unknown;
  }
}
