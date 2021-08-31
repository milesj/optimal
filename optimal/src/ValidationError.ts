export class ValidationError extends Error {
	path: string;

	value: unknown;

	constructor(message: string, path: string = '', value: unknown = undefined) {
		super(message);

		this.name = 'ValidationError';
		this.path = path;
		this.value = value;
	}
}
