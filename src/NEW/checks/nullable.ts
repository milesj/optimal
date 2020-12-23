import { PredicateState } from '../types';

/**
 * Allow null values.
 */
export default function nullable<T>(state: PredicateState<T>) {
  if (__DEV__) {
    state.nullable = true;
  }
}
