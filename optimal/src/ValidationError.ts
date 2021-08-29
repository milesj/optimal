export class ValidationError extends Error {
	errors: ValidationError[] = [];

	file: string = '';

	schema: string = '';

	constructor(message: string) {
		super(message);

		this.name = 'ValidationError';
	}
}
