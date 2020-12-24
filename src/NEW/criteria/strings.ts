import { invariant } from '../helpers';
import { CriteriaState, SchemaState } from '../types';

/**
 * Require field value to be between 2 numbers.
 */
export function match(
  state: SchemaState<string>,
  pattern: RegExp,
  skipIfEmpty: boolean = false,
): void | CriteriaState<string> {
  if (__DEV__) {
    invariant(pattern instanceof RegExp, 'Match requires a regular expression to match against.');

    return {
      skipIfNull: true,
      skipIfOptional: true,
      validate(value, path) {
        if (skipIfEmpty && value === '') {
          return;
        }

        invariant(
          !!value.match(pattern),
          `String does not match. (pattern "${pattern.source}")`,
          path,
        );
      },
    };
  }
}
