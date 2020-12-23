import { invariant } from '../helpers';
import { PredicateState } from '../types';

/**
 * Set a message to log when this field is present.
 */
export default function deprecate<T>(state: PredicateState<T>, message: string) {
  if (__DEV__) {
    invariant(
      typeof message === 'string' && !!message,
      'A non-empty string is required for deprecated messages.',
    );

    state.deprecatedMessage = message;
  }
}
