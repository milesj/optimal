import { invariant } from './helpers';
import { OptimalError } from './OptimalError';
import {
	AnySchema,
	Criteria,
	CriteriaFactory,
	DefaultValueInitializer,
	InferSchemaType,
	Schema,
	SchemaOptions,
	SchemaState,
	UnknownObject,
} from './types';
import { ValidationError } from './ValidationError';

/**
 * Run all validation checks that have been enqueued and return a type casted value.
 * If a value is undefined, inherit the default value, else throw if required.
 * If nullable and the value is null, return early.
 */
function validate<T>(
	state: SchemaState<T>,
	validators: Criteria<T>[],
	initialValue: T | null | undefined,
	path: string = '',
	currentObject: UnknownObject = {},
	rootObject?: UnknownObject,
): T | null {
	const { defaultValue, metadata } = state;

	let value: T | null | undefined = initialValue;

	// Handle undefined
	if (value === undefined) {
		value =
			typeof defaultValue === 'function'
				? (defaultValue as DefaultValueInitializer<T>)(
						path,
						currentObject,
						rootObject ?? currentObject,
				  )
				: defaultValue;

		if (__DEV__) {
			invariant(!state.required, 'Field is required and must be defined.', path);
		}
	} else if (__DEV__) {
		if (metadata.deprecatedMessage) {
			// eslint-disable-next-line no-console
			console.info(`Field "${path}" is deprecated. ${metadata.deprecatedMessage}`);
		}

		invariant(!state.never, 'Field should never be used.', path);
	}

	// Handle null
	if (__DEV__ && value === null) {
		invariant(state.nullable, 'Null is not allowed.', path);
	}

	// Run validations and produce a new value
	const errors: ValidationError[] = [];

	validators.forEach((test) => {
		if (
			(test.skipIfNull && value === null) ||
			(test.skipIfOptional && !state.required && value === state.defaultValue)
		) {
			return;
		}

		try {
			const result = test.validate(value!, path, currentObject, rootObject ?? currentObject);

			if (result !== undefined) {
				value = result as T;
			}
		} catch (error: unknown) {
			// We only want to collect errors when running at the top level, the root,
			// so we do this by checking for the existence of the root object
			if (error instanceof Error && !rootObject) {
				errors.push(new ValidationError(error.message, path, value));

				// Nested validations should just throw immediately instead
				// of looping through all criteria and collecting errors
			} else {
				throw error;
			}
		}
	});

	if (errors.length > 0) {
		const collectionError = new OptimalError();

		errors.forEach((error) => {
			collectionError.addError(error);
		});

		throw collectionError;
	}

	return value!;
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
		type() {
			return state.type;
		},
		validate(value, path, currentObject, rootObject) {
			const result = validate(state, validators, value, path, currentObject, rootObject)!;

			return cast && result !== null ? cast(result) : result;
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
