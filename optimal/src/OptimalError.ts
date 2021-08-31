import { ValidationError } from './ValidationError';

export class OptimalError extends ValidationError {
	file: string = '';

	schema: string = '';

	constructor() {
		super('');

		this.name = 'OptimalError';
	}

	override addError(error: Error) {
		const validError =
			error instanceof ValidationError ? error : new ValidationError(error.message);

		this.errors.push(validError);

		// Avoid indenting at this level
		this.message = `${this.message}\n${error.message}`.trim();
	}
}
