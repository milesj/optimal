import { Constructor, Schema, UnknownObject } from './types';

export function isObject(value: unknown): value is object {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isSchema<T>(value: unknown): value is Schema<T> {
	return (
		isObject(value) &&
		typeof (value as UnknownObject).schema === 'function' &&
		typeof (value as UnknownObject).type === 'function' &&
		typeof (value as UnknownObject).validate === 'function'
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

export function createArray(value: unknown): unknown[] {
	if (value === undefined) {
		return [];
	}

	return Array.isArray(value) ? [...(value as unknown[])] : [value];
}

export function createDate(value: unknown): Date {
	if (value instanceof Date) {
		return value;
	}

	if (value === undefined || value === null) {
		return new Date();
	}

	return new Date(value as number);
}

export function createObject<T = UnknownObject>(value: unknown) {
	return (isObject(value) ? { ...value } : {}) as unknown as T;
}

/**
 * Native `instanceof` checks are problematic, as cross realm checks fail.
 * They will also fail when comparing against source and compiled files.
 * So emulate an `instanceof` check by comparing constructor names.
 */
export function instanceOf<T = unknown>(object: unknown, contract: Constructor<T>): object is T {
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

		throw new Error(`${path ? `Invalid field "${path}".` : ''} ${message}`.trim());
	}
}

export function logUnknown(unknownFields: object, pathPrefix?: string) {
	const unknownKeys = Object.keys(unknownFields);

	if (unknownKeys.length > 0) {
		throw new Error(
			`${pathPrefix ? `Unknown "${pathPrefix}" fields` : 'Unknown fields'}: ${unknownKeys.join(
				', ',
			)}.`,
		);
	}
}

export function pathKey(path: string): string {
	const index = path.lastIndexOf('.');

	return index > 0 ? path.slice(index + 1) : path;
}
