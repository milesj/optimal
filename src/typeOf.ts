import isObject from './isObject';
import { SupportedType } from './types';

// Not supported: shape, custom, tuple
export default function typeOf(value: unknown): SupportedType {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (isObject(value)) {
    return value.constructor.name === 'Object' ? 'object' : 'instance';
  }

  switch (typeof value) {
    case 'boolean':
    case 'function':
    case 'number':
    case 'string':
      // @ts-expect-error
      return typeof value;
    default:
      return 'unknown';
  }
}
