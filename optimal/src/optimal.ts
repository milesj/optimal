import { isObject } from './helpers';
import { OptimalError } from './OptimalError';
import { shape } from './schemas/shape';
import {
	Blueprint,
	DeepPartial,
	OptimalOptions,
	SchemaValidateOptions,
	UnknownObject,
} from './types';
import { ValidationError } from './ValidationError';

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
				throw new OptimalError([error as ValidationError], options);
			}
		},
	};
}
