import { pathKey } from './helpers';

export class ValidationError extends Error {
	errors: ValidationError[] = [];

	noIndent: boolean = false;

	path: string;

	value: unknown;

	constructor(message: string, path: string = '', value: unknown = undefined) {
		super(message);

		this.name = 'ValidationError';
		this.path = path;
		this.value = value;

		if (path) {
			const key = pathKey(path);
			const type = key.includes('[') ? 'member' : 'field';

			this.message = `Invalid ${type} "${key}". ${this.message}`;
		}

		this.noIndent = this.message === '';
	}

	addError(error: Error, forceIndent?: boolean) {
		const validError =
			error instanceof ValidationError ? error : new ValidationError(error.message);
		const hasSameError = this.errors.some((e) => e.message === error.message);

		if (hasSameError) {
			return;
		}

		const indent = !this.noIndent ? '  ' : '';

		this.errors.push(validError);

		if (this.message) {
			this.message += '\n';
		}

		this.message += error.message
			.split('\n')
			.map((line) => (line.match(/^\s*-/) ? `${indent}${line}` : `${indent}- ${line}`))
			.join('\n');
	}

	throwIfApplicable() {
		if (this.errors.length === 0) {
			return;
		}

		// When only 1, avoid the indentation and list format
		if (this.errors.length === 1) {
			throw this.errors[0];
		}

		throw this;
	}
}
