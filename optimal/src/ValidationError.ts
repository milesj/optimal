import { pathKey } from './helpers';

export class ValidationError extends Error {
	errors: ValidationError[] = [];

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
	}

	addError(error: Error) {
		const validError =
			error instanceof ValidationError ? error : new ValidationError(error.message);
		const hasSameError = this.errors.some((e) => e.message === error.message);

		if (hasSameError) {
			return;
		}

		this.errors.push(validError);

		this.message += '\n';
		this.message += error.message
			.split('\n')
			.map((line) => (line.match(/^\s+-/) ? `  ${line}` : `  - ${line}`))
			.join('\n');
	}
}
