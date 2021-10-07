import { ValidationError } from './ValidationError';

export class OptimalError extends ValidationError {
	/** File name/path that is being validated. */
	file: string = '';

	/** Unique name for this validation. */
	schema: string = '';

	constructor(errors: Error[]) {
		super('The following validations have failed:');

		this.name = 'OptimalError';
		this.addErrors(errors);
	}
}
