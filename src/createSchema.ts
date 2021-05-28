import { invariant } from './helpers';
import {
  Criteria,
  CriteriaFactory,
  InferSchemaType,
  Schema,
  SchemaOptions,
  SchemaState,
  UnknownObject,
} from './types';

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
    value = defaultValue;

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
  if (__DEV__) {
    if (value === null) {
      invariant(state.nullable, 'Null is not allowed.', path);
    }
  }

  // Run validations and produce a new value
  validators.forEach((test) => {
    if (
      (test.skipIfNull && value === null) ||
      (test.skipIfOptional && !state.required && value === state.defaultValue)
    ) {
      return;
    }

    const result = test.validate(value!, path, currentObject, rootObject || currentObject);

    if (result !== undefined) {
      value = result as T;
    }
  });

  return value!;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSchema<S extends Schema<any>, T = InferSchemaType<S>>({
  cast,
  criteria,
  defaultValue,
  type,
  validateType,
}: SchemaOptions<T>): S {
  const validators: Criteria<T>[] = [];

  const state: SchemaState<T> = {
    defaultValue,
    metadata: {},
    never: false,
    nullable: false,
    required: false,
    type,
  };

  const schema: Schema<T> = {
    type() {
      return state.type;
    },
    validate(value, path, currentObject, rootObject) {
      const result = validate(state, validators, value, path, currentObject, rootObject)!;

      return cast && result !== null ? cast(result) : result!;
    },
  };

  const resolveCriteria = (crit: CriteriaFactory<T>, args: unknown[] = []) => {
    const validator = crit(state, ...args);

    if (validator) {
      validators.push(validator);
    }

    return schema;
  };

  if (validateType) {
    resolveCriteria(validateType);
  }

  Object.entries(criteria).forEach(([name, crit]) => {
    Object.defineProperty(schema, name, {
      enumerable: true,
      value: (...args: unknown[]) => resolveCriteria(crit, args),
    });
  });

  return schema as S;
}
