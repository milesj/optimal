import { ValidationError } from './ValidationError';

export class OptimalError extends ValidationError {
	file: string = '';

	schema: string = '';

	constructor(errors: Error[]) {
		super('The following validations have failed:');

		this.name = 'OptimalError';
		this.addErrors(errors, true);
	}
}
