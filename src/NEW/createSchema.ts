import { invariant } from './helpers';
import { Criteria, Schema, SchemaOptions, SchemaState, UnknownObject } from './types';

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

  let value: T | null | undefined = initialValue ?? defaultValue;

  // Handle undefined
  if (value === undefined) {
    if (__DEV__) {
      invariant(state.required, 'Field is required and must be defined.', path);
    }
  } else if (__DEV__) {
    if (metadata.deprecatedMessage) {
      // eslint-disable-next-line no-console
      console.info(`Field "${path}" is deprecated. ${metadata.deprecatedMessage}`);
    }

    if (state.never) {
      invariant(false, 'Field should never be used.', path);
    }
  }

  // Handle null
  if (value === null) {
    if (state.nullable) {
      return null;
    }

    if (__DEV__) {
      invariant(false, 'Null is not allowed.', path);
    }
  }

  // Run validations and produce a new value
  validators.forEach((test) => {
    if (
      (test.skipIfNull && state.nullable && value === null) ||
      (test.skipIfOptional && !state.required && value === state.defaultValue)
    ) {
      return;
    }

    const result = test.validate(value!, path, currentObject, rootObject || currentObject);

    if (result !== undefined) {
      value = result as NonNullable<T>;
    }
  });

  return value!;
}

export default function createSchema<T>({
  cast,
  criteria,
  defaultValue,
  type,
  validateType,
}: SchemaOptions<T>) {
  const validators: Criteria<T>[] = [{ skipIfNull: true, validate: validateType }];

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
      const result = validate(state, validators, value, path, currentObject, rootObject);

      return cast && result !== null ? cast(result) : result!;
    },
  };

  Object.entries(criteria).forEach(([name, crit]) => {
    Object.defineProperty(schema, name, {
      enumerable: true,
      value: (...args: unknown[]) => {
        const validator = crit(state, ...args);

        if (validator) {
          validators.push(validator);
        }

        return schema;
      },
    });
  });

  // We return `any` so that the schema type can be narrowed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema as any;
}
