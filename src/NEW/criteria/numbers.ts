import { invariant, isNumber } from '../helpers';
import { CriteriaState, SchemaState } from '../types';

/**
 * Require field value to be between 2 numbers.
 */
export function between(
  state: SchemaState<number>,
  min: number,
  max: number,
  inclusive: boolean = false,
): void | CriteriaState<number> {
  if (__DEV__) {
    invariant(isNumber(min) && isNumber(max), 'Between requires a minimum and maximum number.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(
          isNumber(value) &&
            (inclusive ? value >= min && value <= max : value > min && value < max),
          `Number must be between ${min} and ${max}${inclusive ? ' inclusive' : ''}.`,
          path,
        );
      },
    };
  }
}

/**
 * Require field value to be a float (includes a decimal).
 */
export function float(): void | CriteriaState<number> {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(isNumber(value) && value % 1 !== 0, 'Number must be a float.', path);
      },
    };
  }
}

/**
 * Require field value to be greater than a number.
 */
export function gt(
  state: SchemaState<number>,
  min: number,
  inclusive: boolean = false,
): void | CriteriaState<number> {
  if (__DEV__) {
    invariant(isNumber(min), 'Greater-than requires a minimum number.');

    return {
      skipIfNull: true,
      validate(value, path) {
        if (inclusive) {
          invariant(
            isNumber(value) && value >= min,
            `Number must be greater than or equal to ${min}.`,
            path,
          );
        } else {
          invariant(isNumber(value) && value > min, `Number must be greater than ${min}.`, path);
        }
      },
    };
  }
}

/**
 * Require field value to be greater than or equals to a number.
 */
export function gte(state: SchemaState<number>, min: number): void | CriteriaState<number> {
  return gt(state, min, true);
}

/**
 * Require field value to be an integer.
 */
export function int(): void | CriteriaState<number> {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(Number.isSafeInteger(value), 'Number must be an integer.', path);
      },
    };
  }
}

/**
 * Require field value to be less than a number.
 */
export function lt(
  state: SchemaState<number>,
  max: number,
  inclusive: boolean = false,
): void | CriteriaState<number> {
  if (__DEV__) {
    invariant(isNumber(max), 'Less-than requires a maximum number.');

    return {
      skipIfNull: true,
      validate(value, path) {
        if (inclusive) {
          invariant(
            isNumber(value) && value <= max,
            `Number must be less than or equal to ${max}.`,
            path,
          );
        } else {
          invariant(isNumber(value) && value < max, `Number must be less than ${max}.`, path);
        }
      },
    };
  }
}

/**
 * Require field value to be less than or equals to a number.
 */
export function lte(state: SchemaState<number>, max: number): void | CriteriaState<number> {
  return lt(state, max, true);
}

/**
 * Require field value to be negative and not zero.
 */
export function negative(): void | CriteriaState<number> {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(isNumber(value) && value < 0, 'Number must be negative.', path);
      },
    };
  }
}

/**
 * Require field value to be one of the provided numbers.
 */
export function oneOf(state: SchemaState<number>, list: number[]): void | CriteriaState<number> {
  if (__DEV__) {
    invariant(
      Array.isArray(list) && list.length > 0 && list.every((item) => isNumber(item)),
      'One of requires a non-empty array of numbers.',
    );

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(list.includes(value), `Number must be one of: ${list.join(', ')}`, path);
      },
    };
  }
}

/**
 * Require field value to be positive and not zero.
 */
export function positive(): void | CriteriaState<number> {
  if (__DEV__) {
    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(isNumber(value) && value > 0, 'Number must be positive.', path);
      },
    };
  }
}
