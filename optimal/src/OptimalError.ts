import { ValidationError } from './ValidationError';

export class OptimalError extends Error {
	errors: ValidationError[] = [];

	file: string = '';

	schema: string = '';

	constructor() {
		super('The following validations have failed:');

		this.name = 'OptimalError';
	}

	addError(error: ValidationError) {
		const message = error.message
			.split('\n')
			.map((line) => (line.match(/^\s+-/g) ? `  ${line}` : `  - ${line}`))
			.join('\n');

		this.errors.push(error);
		this.message += `\n${message}`;
	}
}
