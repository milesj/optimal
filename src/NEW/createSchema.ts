import { invariant, isObject } from './helpers';
import {
  Criteria,
  CriteriaValidator,
  Schema,
  SchemaFactory,
  SchemaOptions,
  SchemaState,
  SupportedType,
  UnknownObject,
} from './types';

/**
 * Validate the type of value.
 */
function checkType(type: string, value: unknown, path: string = '') {
  if (__DEV__) {
    switch (type) {
      case 'array':
      case 'tuple':
        invariant(Array.isArray(value), 'Must be an array.', path);
        break;

      case 'custom':
      case 'instance':
      case 'union':
        // Handle in the sub-class
        break;

      case 'object':
      case 'shape':
        invariant(isObject(value), 'Must be a plain object.', path);
        break;

      default:
        // eslint-disable-next-line valid-typeof
        invariant(typeof value === type, `Must be a ${type}.`, path);
        break;
    }
  }
}

/**
 * Run all validation checks that have been enqueued and return a type casted value.
 * If a value is undefined, inherit the default value, else throw if required.
 * If nullable and the value is null, return early.
 */
function validate<T>(
  state: SchemaState<T>,
  validators: CriteriaValidator<T>[],
  initialValue: T,
  path: string = '',
  currentObject: UnknownObject = {},
  rootObject?: UnknownObject,
): T | null {
  const { defaultValue, metadata } = state;

  let value: T | null | undefined = initialValue;

  // Handle undefined
  if (value === undefined) {
    if (!state.required) {
      value = defaultValue;
    } else if (__DEV__) {
      invariant(false, 'Field is required and must be defined.', path);
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
  } else {
    checkType(state.type, value, path);
  }

  // Run validations and produce a new value
  let nextValue = value;

  validators.forEach((validator) => {
    const result = validator(nextValue!, path, currentObject, rootObject || currentObject);

    if (result !== undefined) {
      nextValue = result as NonNullable<T>;
    }
  });

  return nextValue!;
}

export default function createSchema<T, P>(
  type: SupportedType,
  criteria: Record<string, Criteria<T>>,
  { initialValue, cast }: SchemaOptions<T>,
): SchemaFactory<T, P> {
  return (defaultValue) => {
    const validators: CriteriaValidator<T>[] = [];

    const state: SchemaState<T> = {
      defaultValue: defaultValue ?? initialValue,
      metadata: {},
      never: false,
      nullable: false,
      required: false,
      type,
    };

    const predicate: Schema<T> = {
      typeAlias: type,
      validate(value, path, currentObject, rootObject) {
        const result = validate(state, validators, value, path, currentObject, rootObject);

        return cast ? cast(result) : result!;
      },
    };

    // Add and wrap all checkers into the predicate object
    Object.entries(criteria).forEach(([name, crit]) => {
      Object.defineProperty(predicate, name, {
        enumerable: true,
        value: (...args: unknown[]) => {
          const validator = crit(state, ...args);

          if (validator) {
            validators.push(validator);
          }

          return predicate;
        },
      });
    });

    return (predicate as unknown) as P;
  };
}
