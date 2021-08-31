import { invalid, invariant, isObject, isSchema } from '../helpers';
import { StringSchema } from '../schemas/string';
import { Criteria, Options, Schema, SchemaState } from '../types';

/**
 * Require field object keys to be of a string schema type.
 */
export function keysOf<T>(
	state: SchemaState<Record<string, T>>,
	keysSchema: StringSchema,
	options: Options = {},
): Criteria<Record<string, T>> | void {
	if (__DEV__) {
		if (!isSchema(keysSchema) || keysSchema.schema() !== 'string') {
			invariant(false, 'A string schema is required for object keys.');
		}

		return {
			skipIfNull: true,
			validate(value, path, validateOptions) {
				if (isObject(value)) {
					Object.keys(value).forEach((key) => {
						try {
							keysSchema.validate(key, path, validateOptions);
						} catch (error: unknown) {
							if (error instanceof Error) {
								invalid(false, `Invalid key "${key}". ${error.message}`, path, value);
							}
						}
					});
				}
			},
		};
	}
}

/**
 * Require field object to not be empty.
 */
export function notEmpty<T>(
	state: SchemaState<Record<string, T>>,
	options: Options = {},
): Criteria<Record<string, T>> | void {
	if (__DEV__) {
		return {
			skipIfNull: true,
			validate(value, path) {
				invalid(
					Object.keys(value).length > 0,
					options.message ?? 'Object cannot be empty.',
					path,
					value,
				);
			},
		};
	}
}

/**
 * Require field object values to be of a specific schema type.
 * Will rebuild the object and type cast values.
 */
export function of<T>(
	state: SchemaState<Record<string, T>>,
	valuesSchema: Schema<T>,
): Criteria<Record<string, T>> | void {
	if (__DEV__ && !isSchema(valuesSchema)) {
		invariant(false, 'A schema is required for object values.');
	}

	state.type += `<${valuesSchema.type()}>`;

	return {
		skipIfNull: true,
		validate(value, path, validateOptions) {
			if (!isObject(value)) {
				return {};
			}

			const nextValue = { ...value };

			Object.keys(value).forEach((baseKey) => {
				const key = baseKey;

				nextValue[key] = valuesSchema.validate(
					value[key],
					path ? `${path}.${key}` : String(key),
					validateOptions,
				);
			});

			return nextValue;
		},
	};
}

/**
 * Require field object to be of a specific size.
 */
export function sizeOf<T>(
	state: SchemaState<Record<string, T>>,
	size: number,
	options: Options = {},
): Criteria<Record<string, T>> | void {
	if (__DEV__) {
		invariant(typeof size === 'number' && size > 0, 'Size of requires a non-zero positive number.');

		return {
			skipIfNull: true,
			validate(value, path) {
				invalid(
					Object.keys(value).length === size,
					options.message ??
						(size === 1
							? `Object must have ${size} property.`
							: `Object must have ${size} properties.`),
					path,
					value,
				);
			},
		};
	}
}
