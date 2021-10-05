import {
	Constructor,
	DefaultValue,
	DefaultValueInitializer,
	Schema,
	SchemaValidateOptions,
	UnknownObject,
} from './types';
import { ValidationError } from './ValidationError';

export function isObject(value: unknown): value is object {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isSchema<T>(value: unknown): value is Schema<T> {
	return (
		isObject(value) &&
		typeof (value as UnknownObject).schema === 'function' &&
		typeof (value as UnknownObject).state === 'function' &&
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

export function invalid(
	condition: boolean,
	message: unknown,
	path: string = '',
	value: unknown = undefined,
) {
	if (condition) {
		return;
	}

	throw new ValidationError(String(message), path, value);
}

export function invariant(condition: boolean, message: string) {
	if (condition) {
		return;
	}

	throw new Error(message);
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
	if (path.endsWith(']')) {
		const index = path.lastIndexOf('[');

		return index > 0 ? path.slice(index) : path;
	}

	const index = path.lastIndexOf('.');

	return index > 0 ? path.slice(index + 1) : path;
}

export function prettyValue(value: unknown): string | null {
	if (value instanceof Date) {
		return value.toLocaleDateString();
	}

	switch (typeof value) {
		case 'string':
			return `"${value}"`;

		case 'number':
		case 'function':
			return String(value);

		case 'object': {
			if (value === null) {
				return `\`null\``;
			}

			if (value.constructor !== Object) {
				return value.constructor.name === 'Array' ? null : `\`${value.constructor.name}\``;
			}

			return null;
		}

		default:
			return `\`${value}\``;
	}
}

export function extractDefaultValue<T>(
	defaultValue: DefaultValue<T>,
	path: string,
	{ currentObject, rootObject }: SchemaValidateOptions,
) {
	return typeof defaultValue === 'function'
		? (defaultValue as DefaultValueInitializer<T>)(path, currentObject!, rootObject!)
		: defaultValue;
}

export function typeOf(value: unknown): string {
	if (Array.isArray(value)) {
		return 'array/tuple';
	}

	if (isObject(value)) {
		return value.constructor === Object ? 'object/shape' : 'class';
	}

	return typeof value;
}
