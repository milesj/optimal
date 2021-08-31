import { isObject } from './helpers';
import { OptimalError } from './OptimalError';
import { shape } from './schemas/shape';
import { Blueprint, DeepPartial, UnknownObject } from './types';
import { ValidationError } from './ValidationError';

export interface OptimalOptions {
	file?: string;
	name?: string;
	prefix?: string;
	unknown?: boolean;
}

export interface Optimal<T extends object> {
	configure: (options: OptimalOptions) => void;
	validate: (struct: DeepPartial<T>) => T;
}

export function optimal<Schemas extends object>(
	blueprint: Blueprint<Schemas>,
	baseOpts: OptimalOptions = {},
): Optimal<Schemas> {
	const options: OptimalOptions = {};
	let schema = shape(blueprint);

	function configure(nextOpts: OptimalOptions) {
		if (__DEV__ && !isObject(nextOpts)) {
			throw new TypeError('Optimal options must be a plain object.');
		}

		Object.assign(options, nextOpts);
		schema = schema.exact(!options.unknown);
	}

	configure(baseOpts);

	return {
		configure,
		validate(struct) {
			const object = struct as UnknownObject;

			try {
				return schema.validate(struct, options.prefix ?? '', {
					collectErrors: true,
					currentObject: object,
					rootObject: object,
				});
			} catch (error: unknown) {
				let invalid: OptimalError;

				if (error instanceof OptimalError) {
					invalid = error;
				} else {
					invalid = new OptimalError();
					invalid.addError(error as ValidationError);
				}

				if (options.name) {
					invalid.schema = options.name;
				}

				if (options.file) {
					invalid.file = options.file;
				}

				throw invalid;
			}
		},
	};
}
