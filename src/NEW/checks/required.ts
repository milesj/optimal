import { PredicateState } from '../types';

/**
 * Require this field to be explicitly defined.
 */
export default function required<T>(state: PredicateState<T>) {
  state.required = true;
}
