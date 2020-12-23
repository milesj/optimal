import { PredicateState } from '../types';

/**
 * Require this field to be explicitly defined.
 */
export default function required<T>(state: PredicateState<T>) {
  if (__DEV__) {
    state.required = true;
  }
}
