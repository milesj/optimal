import { PredicateState } from '../types';

/**
 * Require this field to NOT be explicitly defined.
 */
export default function nonRequired<T>(state: PredicateState<T>) {
  state.required = false;
}
