import { createDate, invariant, isValidDate } from '../helpers';
import { Criteria, MaybeDate, SchemaState } from '../types';

/**
 * Require field value to be after the provided date.
 */
export function after(state: SchemaState<Date>, date: MaybeDate): void | Criteria<Date> {
  if (__DEV__) {
    const afterDate = createDate(date);

    invariant(isValidDate(afterDate), 'After date must be a valid date.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(
          isValidDate(value) && value > afterDate,
          `Date must be after ${afterDate.toISOString()}.`,
          path,
        );
      },
    };
  }
}

/**
 * Require field value to be before the provided date.
 */
export function before(state: SchemaState<Date>, date: MaybeDate): void | Criteria<Date> {
  if (__DEV__) {
    const beforeDate = createDate(date);

    invariant(isValidDate(beforeDate), 'Before date must be a valid date.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(
          isValidDate(value) && value < beforeDate,
          `Date must be before ${beforeDate.toISOString()}.`,
          path,
        );
      },
    };
  }
}

/**
 * Require field value to be between 2 date ranges.
 */
export function between(
  state: SchemaState<Date>,
  start: MaybeDate,
  end: MaybeDate,
  inclusive: boolean = false,
): void | Criteria<Date> {
  if (__DEV__) {
    const startDate = createDate(start);
    const endDate = createDate(end);

    invariant(isValidDate(startDate), 'Between start date must be a valid date.');
    invariant(isValidDate(endDate), 'Between end date must be a valid date.');

    return {
      skipIfNull: true,
      validate(value, path) {
        invariant(
          isValidDate(value) &&
            (inclusive
              ? value >= startDate && value <= endDate
              : value > startDate && value < endDate),
          `Date must be between ${startDate.toISOString()} and ${endDate.toISOString()}${
            inclusive ? ' inclusive' : ''
          }.`,
          path,
        );
      },
    };
  }
}
