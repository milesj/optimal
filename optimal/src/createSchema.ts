import { extractDefaultValue, invalid, tryAndCollect } from './helpers';
import { OptimalError } from './OptimalError';
import {
	AnySchema,
	Criteria,
	CriteriaFactory,
	InferSchemaType,
	Schema,
	SchemaOptions,
	SchemaState,
	SchemaValidateOptions,
} from './types';

/**
 * Run all validation checks that have been enqueued and return a type casted value.
 * If a value is undefined, inherit the default value, else throw if required.
 * If nullable and the value is null, return early.
 */
function validate<T>(
	state: SchemaState<T>,
	validators: Criteria<T>[],
	initialValue: unknown,
	path: string = '',
	{
		collectErrors = true,
		currentObject = {},
		rootObject = currentObject,
	}: SchemaValidateOptions = {},
): T | null | undefined {
	const { defaultValue, metadata } = state;

	let value: unknown = initialValue;

	// Handle undefined
	if (value === undefined) {
		if (!state.undefinable) {
			value = extractDefaultValue(defaultValue, path, { currentObject, rootObject });
		}
	} else {
		if (__DEV__ && metadata.deprecatedMessage) {
			// eslint-disable-next-line no-console
			console.info(`Field "${path}" is deprecated. ${metadata.deprecatedMessage}`);
		}

		invalid(!state.never, 'Field should never be used.', path);
	}

	// Handle null
	if (value === null) {
		invalid(state.nullable, 'Null is not allowed.', path, null);
	}

	// Run validations and produce a new value
	const optimalError = new OptimalError();

	validators.forEach((test) => {
		if (
			(!test.dontSkipIfNull && state.nullable && value === null) ||
			(!test.dontSkipIfUndefined && state.undefinable && value === undefined) ||
			state.never
		) {
			return;
		}

		tryAndCollect(
			() => {
				const result = test.validate(value as T, path, {
					collectErrors,
					currentObject,
					rootObject,
				});

				if (result !== undefined) {
					value = result as T;
				}
			},
			optimalError,
			collectErrors,
		);
	});

	if (optimalError.errors.length > 0) {
		throw optimalError;
	}

	return value as T;
}

export function createSchema<S extends AnySchema, T = InferSchemaType<S>>(
	{ api, cast, defaultValue, type }: SchemaOptions<T>,
	criteria: (Criteria<T> | CriteriaFactory<T>)[] = [],
): S {
	const state: SchemaState<T> = {
		defaultValue,
		metadata: {},
		never: false,
		nullable: false,
		required: false,
		type,
		undefinable: false,
	};

	const validators: Criteria<T>[] = [];

	criteria.forEach((crit) => {
		if (typeof crit === 'function') {
			const validator = crit(state);

			if (validator) {
				validators.push(validator);
			}
		} else {
			validators.push(crit);
		}
	});

	const schema: Schema<T> = {
		schema() {
			return type;
		},
		state() {
			return state;
		},
		type() {
			return state.type;
		},
		// @ts-expect-error Ignore null/undefined
		validate(value, path, options) {
			const result = validate(state, validators, value, path, options);

			if (state.nullable && result === null) {
				return null;
			}

			if (state.undefinable && result === undefined) {
				return undefined;
			}

			return cast ? cast(result) : result;
		},
	};

	Object.entries(api).forEach(([name, method]) => {
		Object.defineProperty(schema, name, {
			enumerable: true,
			// Create a new schema so that our chainable API is immutable
			value: (...args: unknown[]) =>
				createSchema({ api, cast, defaultValue, type }, [
					...criteria,
					(nextState) => method(nextState, ...args),
				]),
		});
	});

	return schema as S;
}
