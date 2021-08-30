import { ValidationError } from './ValidationError';

export class OptimalError extends Error {
	errors: ValidationError[] = [];

	file: string = '';

	schema: string = '';

	constructor() {
		super('');

		this.name = 'OptimalError';
	}
}
