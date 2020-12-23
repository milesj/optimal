import { invariant } from '../helpers';
import { CriteriaValidator, SchemaState } from '../types';

/**
 * Mark that this field can ONLY use a value that matches the default value.
 */
export default function only<T>(state: SchemaState<T>): void | CriteriaValidator<T> {
  if (__DEV__) {
    const { defaultValue } = state;

    invariant(
      defaultValue !== null && defaultValue !== undefined,
      'Only requires a non-empty default value.',
    );

    invariant(
      // eslint-disable-next-line valid-typeof
      typeof defaultValue === state.type,
      `Only requires a default value of type ${state.type}.`,
    );

    return (value, path) => {
      invariant(value === defaultValue, `Value may only be "${String(defaultValue)}".`, path);
    };
  }
}
