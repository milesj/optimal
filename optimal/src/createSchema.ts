import { extractDefaultValue, invalid } from './helpers';
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

function validate<T>(
	state: SchemaState<T>,
	validators: Criteria<T>[],
	initialValue: unknown,
	path: string = '',
	{ currentObject = {}, rootObject = currentObject }: SchemaValidateOptions = {},
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

		invalid(!state.never, metadata.neverMessage ?? 'Field should never be used.', path);
	}

	// Handle null
	if (value === null) {
		invalid(state.nullable, metadata.nullableMessage ?? 'Null is not allowed.', path, null);
	}

	// Run validations and produce a new value
	validators.forEach((test) => {
		if (
			(!test.dontSkipIfNull && state.nullable && value === null) ||
			(!test.dontSkipIfUndefined && state.undefinable && value === undefined) ||
			state.never
		) {
			return;
		}

		const result = test.validate(value as T, path, {
			currentObject,
			rootObject,
		});

		if (result !== undefined) {
			value = result as T;
		}
	});

	return value as T;
}

/**
 * Create a custom schema with a defined list of criteria.
 * When a value is being validated, all chained criteria will be ran
 * to test for failures. If no failures, a type casted value is returned.
 */
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
