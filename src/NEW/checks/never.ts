import { PredicateState } from '../types';

/**
 * Mark that this field should never be used.
 */
export default function never<T>(state: PredicateState<T>) {
  if (__DEV__) {
    state.defaultValue = undefined;
    state.never = true;
  }
}
