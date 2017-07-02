/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './isObject';

import type { SupportedType } from './types';

export default function typeOf(value: *): SupportedType {
  if (Array.isArray(value)) {
    return 'array';

  } else if (isObject(value)) {
    return value.constructor ? 'instance' : 'object';
  }

  // $FlowIgnore
  return (typeof value);
}
