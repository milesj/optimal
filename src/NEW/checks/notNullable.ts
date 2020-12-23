import { PredicateState } from '../types';

/**
 * Disallow null values.
 */
export default function nonNullable<T>(state: PredicateState<T>) {
  state.nullable = false;
}
