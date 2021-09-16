import { isObject } from './helpers';
import { OptimalError } from './OptimalError';
import { shape } from './schemas/shape';
import { Blueprint, DeepPartial, SchemaValidateOptions, UnknownObject } from './types';
import { ValidationError } from './ValidationError';

export interface OptimalOptions {
	/** Include a filename in validation error messages. Can be used in conjunction with
  `name`. */
	file?: string;
	/** Include a unique identifier in validation error messages. Can be used in conjunction
  with `file`. */
	name?: string;
	/** @internal */
	prefix?: string;
	/** Allow unknown fields to be passed within the object being validate. Otherwise, an error will
  be thrown. */
	unknown?: boolean;
}

export interface Optimal<T extends object> {
	/** Modify optimal options after instantiation. */
	configure: (options: OptimalOptions) => void;
	/**
	 * Validate an object with the defined blueprint and options,
	 * and return a deeply built object with correct types and values.
	 */
	validate: (object: DeepPartial<T>, options?: SchemaValidateOptions) => Required<T>;
}

export function optimal<Schemas extends object>(
	blueprint: Blueprint<Schemas>,
	baseOpts: OptimalOptions = {},
): Optimal<Schemas> {
	const options: OptimalOptions = {};
	let schema = shape(blueprint);

	function configure(nextOpts: OptimalOptions) {
		if (!isObject(nextOpts)) {
			throw new TypeError('Optimal options must be a plain object.');
		}

		Object.assign(options, nextOpts);
		schema = schema.exact(!options.unknown);
	}

	configure(baseOpts);

	return {
		configure,
		validate(struct, validateOptions) {
			const object = struct as UnknownObject;

			try {
				return schema.validate(struct, options.prefix ?? '', {
					...validateOptions,
					currentObject: object,
					rootObject: object,
				});
			} catch (error: unknown) {
				const invalid =
					error instanceof OptimalError ? error : new OptimalError([error as ValidationError]);
				let prefix = '';

				if (options.name) {
					invalid.schema = options.name;
					prefix = options.name;
				}

				if (options.file) {
					invalid.file = options.file;
					prefix = prefix ? `${prefix} (${options.file})` : options.file;
				}

				if (prefix) {
					invalid.message = `${prefix}: ${invalid.message}`;
				}

				throw invalid;
			}
		},
	};
}
