import { pathKey } from './helpers';

const PATH_TOKEN = /"(\[\d+]|\w+)"/i;
const LIST_CHECK = /(\n|\s)+-/;

export class ValidationError extends Error {
	/** List of invalidations for the field. */
	errors: ValidationError[] = [];

	/** Object path for the invalid field. */
	path: string;

	/** Field value at time of failure. */
	value: unknown;

	/** Whether an original message was provided through the constructor. */
	hasOriginalMessage: boolean = false;

	/** Whether a "Invalid path" message was prepended to the original message. */
	hasPathPrefix: boolean = false;

	constructor(message: Error[] | string, path: string = '', value: unknown = undefined) {
		super(typeof message === 'string' ? message : '');

		this.name = 'ValidationError';
		this.path = path;
		this.value = value;
		this.hasOriginalMessage = this.message !== '';

		if (path) {
			const key = pathKey(path);
			const type = key.includes('[') ? 'member' : 'field';

			this.message = `Invalid ${type} "${key}". ${this.message}`.trim();
			this.hasPathPrefix = true;
		}

		if (Array.isArray(message)) {
			this.addErrors(message);
		}
	}

	addErrors(errors: Error[]) {
		this.errors = errors.map((error) =>
			error instanceof ValidationError ? error : new ValidationError(error.message),
		);

		// Inline error if only 1 and...
		const firstError = this.errors[0];

		if (
			this.errors.length === 1 &&
			((!this.hasOriginalMessage && !firstError.message.match(LIST_CHECK)) || this.message === '')
		) {
			this.message =
				// Avoid double path prefixes by concatenating them
				this.hasPathPrefix && firstError.hasPathPrefix
					? firstError.message.replace(
							PATH_TOKEN,
							(match, subPath: string) =>
								`"${this.path}${subPath.startsWith('[') ? '' : '.'}${subPath}"`,
					  )
					: `${this.message} ${firstError.message}`.trim();

			// Bubble this up
			if (firstError.hasPathPrefix) {
				this.hasPathPrefix = true;
			}

			return this;
		}

		// Otherwise list out all errors
		const indent = this.hasOriginalMessage || this.hasPathPrefix ? '  ' : '';
		const used = new Set<string>();

		this.errors.forEach((error) => {
			if (used.has(error.message)) {
				return;
			}

			if (this.message) {
				this.message += '\n';
			}

			this.message += error.message
				.split('\n')
				.map((line) => (line.match(/^\s*-/) ? `${indent}${line}` : `${indent}- ${line}`))
				.join('\n');

			used.add(error.message);
		});

		return this;
	}
}
