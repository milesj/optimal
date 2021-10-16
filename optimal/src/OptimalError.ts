import { OptimalOptions } from './types';
import { ValidationError } from './ValidationError';

export class OptimalError extends ValidationError {
	/** File name/path that is being validated. */
	file: string = '';

	/** Unique name for this validation. */
	schema: string = '';

	constructor(errors: Error[], options: OptimalOptions) {
		super('The following validations have failed:');

		this.name = 'OptimalError';

		let label = '';

		if (options.name) {
			this.schema = options.name;
			label = `\`${options.name}\``;
		}

		if (options.file) {
			this.file = options.file;
			label = label ? `${label} (${options.file})` : `\`${options.file}\``;
		}

		if (label) {
			this.message = `The following validations have failed for ${label}:`;
		}

		this.addErrors(errors);
	}
}
