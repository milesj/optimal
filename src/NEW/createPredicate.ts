import { invariant, isObject } from './helpers';
import {
  Checker,
  CheckerCallback,
  PredicateFactory,
  PredicateState,
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
  state: PredicateState<T>,
  checks: CheckerCallback<T>[],
  initialValue: T,
  path: string = '',
  currentObject: UnknownObject = {},
  rootObject?: UnknownObject,
): T | null {
  const { defaultValue } = state;

  let value: T | null | undefined = initialValue;

  // Handle undefined
  if (value === undefined) {
    if (!state.required) {
      value = defaultValue;
    } else if (__DEV__) {
      invariant(false, 'Field is required and must be defined.', path);
    }
  } else if (__DEV__) {
    if (state.deprecatedMessage) {
      // eslint-disable-next-line no-console
      console.info(`Field "${path}" is deprecated. ${state.deprecatedMessage}`);
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

  checks.forEach((checker) => {
    const result = checker(nextValue!, path, currentObject, rootObject || currentObject);

    if (result !== undefined) {
      nextValue = result as NonNullable<T>;
    }
  });

  return nextValue!;
}

export default function createPredicate<T, P>(
  type: SupportedType,
  checkers: Record<string, Checker<T>>,
  initialValue?: T,
  castValue?: (value: unknown) => T,
): PredicateFactory<T, P> {
  return (defaultValue) => {
    const cases: CheckerCallback<T>[] = [];

    const state: PredicateState<T> = {
      defaultValue: defaultValue ?? initialValue,
      deprecatedMessage: '',
      never: false,
      nullable: false,
      required: false,
      type,
    };

    const predicate: UnknownObject = {};

    // Add and wrap all checkers into the predicate object
    Object.entries(checkers).forEach(([name, checker]) => {
      predicate[checker.name] = (...args: unknown[]) => {
        const result = checker(state, ...args);

        if (result) {
          cases.push(result);
        }

        return predicate;
      };
    });

    // Add our custom validation
    predicate.validate = (
      value: T,
      path?: string,
      currentObject?: UnknownObject,
      rootObject?: UnknownObject,
    ) => {
      const result = validate(state, cases, value, path, currentObject, rootObject);

      if (castValue) {
        return castValue(result);
      }

      return result;
    };

    return (predicate as unknown) as P;
  };
}
