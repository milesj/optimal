import { SchemaState } from '../types';

/**
 * Mark that this field should never be used.
 */
export default function never<T>(state: SchemaState<T>) {
  state.defaultValue = undefined;
  state.never = true;
}
