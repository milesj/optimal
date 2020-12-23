import { PredicateState } from '../types';

/**
 * Require this field to NOT be explicitly defined.
 */
export default function nonRequired<T>(state: PredicateState<T>) {
  if (__DEV__) {
    state.required = false;
  }
}
