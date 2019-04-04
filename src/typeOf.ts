import isObject from './isObject';
import { SupportedType } from './types';

// Not supported: shape, custom
export default function typeOf(value: unknown): SupportedType {
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
