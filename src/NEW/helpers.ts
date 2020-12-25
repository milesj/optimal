import { Constructor, UnknownObject, Schema } from './types';

export function createDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(value as number);
}

/**
 * Native `instanceof` checks are problematic, as cross realm checks fail.
 * They will also fail when comparing against source and compiled files.
 * So emulate an `instanceof` check by comparing constructor names.
 */
export function instanceOf<T = unknown>(
  object: unknown,
  contract: Constructor<T> | Function,
): object is T {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (object instanceof contract) {
    return true;
  }

  let current = object;

  while (current) {
    if (current.constructor.name === 'Object') {
      return false;
    }

    if (
      current.constructor.name === contract.name ||
      (current instanceof Error && current.name === contract.name)
    ) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    current = Object.getPrototypeOf(current);
  }

  return false;
}

export function invariant(condition: boolean, message: string, path: string = '') {
  if (__DEV__) {
    if (condition) {
      return;
    }

    // TODO no errorPrefix
    const prefix = path ? `Invalid field "${path}".` : '';

    throw new Error(`${prefix} ${message}`.trim());
  }
}

export function isObject(value: unknown): value is object {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isSchema<T>(value: unknown): value is Schema<T> {
  return (
    isObject(value) &&
    typeof (value as UnknownObject).validate === 'function' &&
    typeof (value as UnknownObject).type === 'function'
  );
}

export function isValidDate(value: Date): value is Date {
  return (
    Object.prototype.toString.call(value) === '[object Date]' &&
    !Number.isNaN(value.getTime()) &&
    value.toString() !== 'Invalid Date'
  );
}

export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

export function pathKey(path: string): string {
  const index = path.lastIndexOf('.');

  return index > 0 ? path.slice(index + 1) : path;
}
